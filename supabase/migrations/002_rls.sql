alter table public.profiles enable row level security;
alter table public.facilities enable row level security;
alter table public.booking_settings enable row level security;
alter table public.courts enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.blocked_times enable row level security;
alter table public.admin_audit_log enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select coalesce(
    (select raw_user_meta_data->>'role'='admin' from auth.users where id=uid),
    false
  )
$$;

drop policy if exists "active facilities" on public.facilities;
create policy "active facilities" on public.facilities for select using(is_active);

drop policy if exists "public settings" on public.booking_settings;
create policy "public settings" on public.booking_settings for select using(true);

drop policy if exists "active courts" on public.courts;
create policy "active courts" on public.courts for select using(is_active);

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using(id=auth.uid());

drop policy if exists "own bookings" on public.bookings;
create policy "own bookings" on public.bookings for select using(user_id=auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "own payments" on public.payments;
create policy "own payments" on public.payments for select using(exists(select 1 from public.bookings b where b.id=booking_id and (b.user_id=auth.uid() or public.is_admin(auth.uid()))));

drop policy if exists "admin courts" on public.courts;
create policy "admin courts" on public.courts for all using(public.is_admin(auth.uid())) with check(public.is_admin(auth.uid()));

drop policy if exists "admin settings" on public.booking_settings;
create policy "admin settings" on public.booking_settings for all using(public.is_admin(auth.uid())) with check(public.is_admin(auth.uid()));

drop policy if exists "admin blocks" on public.blocked_times;
create policy "admin blocks" on public.blocked_times for all using(public.is_admin(auth.uid())) with check(public.is_admin(auth.uid()));

drop policy if exists "admin audit" on public.admin_audit_log;
create policy "admin audit" on public.admin_audit_log for select using(public.is_admin(auth.uid()));