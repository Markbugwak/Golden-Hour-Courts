alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('user','admin'));

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.id = uid),
    false
  );
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select public.is_admin(auth.uid());
$$;

revoke all on function public.current_user_is_admin() from public;
grant execute on function public.current_user_is_admin() to anon, authenticated;

drop policy if exists "admin bookings" on public.bookings;
create policy "admin bookings"
on public.bookings
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admin payments" on public.payments;
create policy "admin payments"
on public.payments
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admin audit insert" on public.admin_audit_log;
create policy "admin audit insert"
on public.admin_audit_log
for insert
with check (public.is_admin(auth.uid()));

create or replace function public.admin_cancel_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path=public
as $$
declare
  b public.bookings;
begin
  if auth.uid() is null or not public.is_admin(auth.uid()) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  update public.bookings
  set status='cancelled',
      hold_expires_at=null,
      updated_at=now()
  where id=p_booking_id
    and status in ('pending_payment','confirmed')
  returning * into b;

  if b.id is null then
    raise exception 'BOOKING_NOT_FOUND_OR_NOT_CANCELLABLE';
  end if;

  update public.payments
  set status=case when status='paid' then 'refund_pending'::public.payment_status else 'cancelled'::public.payment_status end,
      updated_at=now()
  where booking_id=b.id;

  insert into public.admin_audit_log(actor_id,action,entity_type,entity_id,metadata)
  values(auth.uid(),'cancel_booking','booking',b.id,jsonb_build_object('booking_reference',b.booking_reference));

  return b;
end;
$$;

revoke all on function public.admin_cancel_booking(uuid) from public;
grant execute on function public.admin_cancel_booking(uuid) to authenticated;

create or replace function public.admin_update_booking_status(
  p_booking_id uuid,
  p_status public.booking_status
)
returns public.bookings
language plpgsql
security definer
set search_path=public
as $$
declare
  b public.bookings;
begin
  if auth.uid() is null or not public.is_admin(auth.uid()) then
    raise exception 'ADMIN_REQUIRED';
  end if;

  update public.bookings
  set status=p_status,
      hold_expires_at=case when p_status='pending_payment' then hold_expires_at else null end,
      updated_at=now()
  where id=p_booking_id
  returning * into b;

  if b.id is null then
    raise exception 'BOOKING_NOT_FOUND';
  end if;

  insert into public.admin_audit_log(actor_id,action,entity_type,entity_id,metadata)
  values(auth.uid(),'update_booking_status','booking',b.id,jsonb_build_object('status',p_status::text));

  return b;
end;
$$;

revoke all on function public.admin_update_booking_status(uuid,public.booking_status) from public;
grant execute on function public.admin_update_booking_status(uuid,public.booking_status) to authenticated;
