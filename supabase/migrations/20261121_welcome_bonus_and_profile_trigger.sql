-- MOVA: create each member profile once and record a non-withdrawable welcome bonus.
-- Run this in Supabase SQL Editor. Safe to re-run.

alter table public.profiles
  add column if not exists welcome_bonus_kobo bigint not null default 910000;

-- Existing accounts receive the display-only bonus field too. This is NOT a wallet
-- ledger credit and must never be included in withdrawal calculations.
update public.profiles
set welcome_bonus_kobo = 910000
where welcome_bonus_kobo is null;

create or replace function public.handle_new_mova_member()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_full_name text;
  v_username text;
  v_referral_code text;
begin
  v_full_name := coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1));
  v_username := lower(regexp_replace(coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)), '[^a-zA-Z0-9_]', '', 'g'));
  if v_username = '' then v_username := 'mova' || substr(replace(new.id::text, '-', ''), 1, 8); end if;
  v_referral_code := upper(substr(replace(new.id::text, '-', ''), 1, 8));

  insert into public.profiles (
    id, full_name, username, phone, country, role,
    membership_status, referral_code, welcome_bonus_kobo
  ) values (
    new.id,
    v_full_name,
    v_username || '_' || substr(replace(new.id::text, '-', ''), 1, 5),
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(nullif(new.raw_user_meta_data->>'country', ''), 'Nigeria'),
    'user',
    'standard',
    v_referral_code,
    910000
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_mova_auth_user_created on auth.users;
create trigger on_mova_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_mova_member();

-- Ensure RLS remains enabled. The trigger runs with its owner's privileges.
alter table public.profiles enable row level security;

-- This value is intentionally absent from wallet_ledger. Do not expose an update
-- policy for it and do not use it in withdrawal calculations.
