-- Golden Hour Courts admin setup
-- 1) Create your normal account in the website first.
-- 2) Replace the email below with the exact email used for that account.
-- 3) Run this SQL in Supabase SQL Editor.
--
-- This does not create a password and does not expose service-role credentials.

insert into public.profiles (id, display_name, role)
select
  id,
  coalesce(raw_user_meta_data->>'display_name', split_part(coalesce(email,''),'@',1), 'Admin'),
  'admin'
from auth.users
where lower(email)=lower('YOUR_EMAIL_HERE')
on conflict (id) do update
set role='admin';

-- Verify:
select p.id, p.display_name, p.role, u.email
from public.profiles p
join auth.users u on u.id=p.id
where p.role='admin';
