-- MOVA: award one ₦9,100 welcome bonus to every newly registered member.
-- Run once in Supabase SQL Editor. Safe to re-run; the unique idempotency key
-- prevents duplicate credits. The bonus remains non-withdrawable.

alter table public.profiles
  add column if not exists welcome_bonus_kobo bigint not null default 910000;

create or replace function public.mova_issue_welcome_bonus()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallet_ledger (
    user_id, activity_type, amount_kobo, status, idempotency_key, metadata
  ) values (
    new.id,
    'welcome_bonus',
    910000,
    'approved',
    'welcome-bonus:' || new.id::text,
    jsonb_build_object(
      'display_label', 'Welcome Bonus',
      'description', 'MOVA welcome bonus',
      'wallet_source', 'welcome_pack',
      'withdrawable', false
    )
  ) on conflict (idempotency_key) do nothing;
  return new;
end;
$$;

drop trigger if exists mova_profile_welcome_bonus_trigger on public.profiles;
drop trigger if exists mova_credit_welcome_bonus on public.profiles;
create trigger mova_profile_welcome_bonus_trigger
  after insert on public.profiles
  for each row execute function public.mova_issue_welcome_bonus();

create or replace function public.mova_create_profile_after_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_username text;
  v_referral_code text;
begin
  v_full_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(new.email, 'mova@member.local'), '@', 1));
  v_username := lower(coalesce(
    nullif(regexp_replace(trim(coalesce(new.raw_user_meta_data ->> 'username', '')), '[^a-zA-Z0-9_]', '', 'g'), ''),
    'mova_' || substr(replace(new.id::text, '-', ''), 1, 8)
  ));
  v_referral_code := 'MOVA-' || upper(substr(replace(new.id::text, '-', ''), 1, 10));

  insert into public.profiles (
    id, full_name, username, phone, country, role, membership_status,
    referral_code, welcome_bonus_kobo
  ) values (
    new.id,
    v_full_name,
    v_username || '_' || substr(replace(new.id::text, '-', ''), 1, 5),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'country'), ''), 'Nigeria'),
    'user',
    'standard',
    v_referral_code,
    910000
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists mova_auth_user_profile_trigger on auth.users;
drop trigger if exists on_mova_auth_user_created on auth.users;
create trigger mova_auth_user_profile_trigger
  after insert on auth.users
  for each row execute function public.mova_create_profile_after_signup();

-- Backfill existing profiles once, using the same unique key as the signup trigger.
insert into public.wallet_ledger (
  user_id, activity_type, amount_kobo, status, idempotency_key, metadata
)
select
  p.id,
  'welcome_bonus',
  910000,
  'approved',
  'welcome-bonus:' || p.id::text,
  jsonb_build_object(
    'display_label', 'Welcome Bonus',
    'description', 'MOVA welcome bonus',
    'wallet_source', 'welcome_pack',
    'withdrawable', false
  )
from public.profiles p
on conflict (idempotency_key) do nothing;
