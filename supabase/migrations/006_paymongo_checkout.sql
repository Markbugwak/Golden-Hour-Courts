alter table public.payments add column if not exists provider_checkout_url text;

drop function if exists public.prepare_payment(uuid);

create function public.prepare_payment(p_booking_id uuid)
returns table(
  booking_id uuid,
  booking_reference text,
  amount integer,
  currency text,
  payment_id uuid,
  checkout_id text,
  checkout_url text
)
language plpgsql
security definer
set search_path=public
as $$
begin
  return query
  select
    b.id,
    b.booking_reference,
    b.total_amount,
    b.currency,
    p.id,
    p.provider_checkout_id,
    p.provider_checkout_url
  from public.bookings b
  join public.payments p on p.booking_id=b.id
  where b.id=p_booking_id
    and b.user_id=auth.uid()
    and b.status='pending_payment'
    and (b.hold_expires_at is null or b.hold_expires_at>now());

  if not found then
    raise exception 'BOOKING_NOT_PAYABLE';
  end if;
end;
$$;

revoke all on function public.prepare_payment(uuid) from public;
grant execute on function public.prepare_payment(uuid) to authenticated;
