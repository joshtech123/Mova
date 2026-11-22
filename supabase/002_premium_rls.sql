-- MOVA Premium server-side authorization
-- Apply AFTER 001_initial_schema.sql in Supabase SQL Editor.
-- This migration protects database records even if a member bypasses the UI.
-- Do not expose the Supabase service-role key in the browser.

create extension if not exists pgcrypto;

-- SECURITY DEFINER avoids recursive RLS when checking the member's own profile.
create or replace function public.mova_is_premium()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.membership_status = 'premium'
  );
$$;

create or replace function public.mova_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.mova_is_premium() from public;
revoke all on function public.mova_is_admin() from public;
grant execute on function public.mova_is_premium() to authenticated;
grant execute on function public.mova_is_admin() to authenticated;

-- Close a privilege-escalation hole in the initial profile update policy.
-- Members may edit only ordinary profile fields, never their role or Premium status.
drop policy if exists "profile update own" on public.profiles;
revoke update on public.profiles from authenticated;
grant update (full_name, phone, country) on public.profiles to authenticated;

drop policy if exists "profile update safe fields" on public.profiles;
create policy "profile update safe fields"
on public.profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Payment submissions may be created/read by the owner, but the client cannot
-- confirm/reject payments or grant Premium. Confirmation belongs to a trusted server/admin.
drop policy if exists "payment read own" on public.premium_payments;
drop policy if exists "payment insert own" on public.premium_payments;
create policy "payment read own"
on public.premium_payments for select to authenticated
using (auth.uid() = user_id or public.mova_is_admin());
create policy "payment insert own"
on public.premium_payments for insert to authenticated
with check (auth.uid() = user_id and status = 'pending' and verified_by is null and verified_at is null);
drop policy if exists "payment admin update" on public.premium_payments;
create policy "payment admin update"
on public.premium_payments for update to authenticated
using (public.mova_is_admin())
with check (public.mova_is_admin());

-- Wallet ledger is read-only to members. Credits, reversals and approvals must
-- be written by a trusted server using the service-role key.
drop policy if exists "ledger read own" on public.wallet_ledger;
create policy "ledger read own"
on public.wallet_ledger for select to authenticated
using (auth.uid() = user_id or public.mova_is_admin());
revoke insert, update, delete on public.wallet_ledger from anon, authenticated;

-- Premium-only activity tables from the initial schema.
drop policy if exists "bank read own" on public.member_bank_accounts;
drop policy if exists "bank insert own" on public.member_bank_accounts;
create policy "bank read own premium"
on public.member_bank_accounts for select to authenticated
using ((auth.uid() = user_id and public.mova_is_premium()) or public.mova_is_admin());
create policy "bank insert own premium"
on public.member_bank_accounts for insert to authenticated
with check (auth.uid() = user_id and public.mova_is_premium());

drop policy if exists "game read own" on public.game_sessions;
drop policy if exists "game insert own" on public.game_sessions;
create policy "game read own premium"
on public.game_sessions for select to authenticated
using ((auth.uid() = user_id and public.mova_is_premium()) or public.mova_is_admin());
create policy "game insert own premium"
on public.game_sessions for insert to authenticated
with check (auth.uid() = user_id and public.mova_is_premium());

-- Add server-protected tables for Premium-only experiences.
create table if not exists public.global_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(message) between 1 and 4000),
  sender_type text not null default 'member' check (sender_type in ('member','assistant')),
  created_at timestamptz not null default now()
);
alter table public.global_chat_messages enable row level security;
drop policy if exists "premium chat read own" on public.global_chat_messages;
drop policy if exists "premium chat insert own" on public.global_chat_messages;
create policy "premium chat read own"
on public.global_chat_messages for select to authenticated
using ((auth.uid() = user_id and public.mova_is_premium()) or public.mova_is_admin());
create policy "premium chat insert own"
on public.global_chat_messages for insert to authenticated
with check (auth.uid() = user_id and public.mova_is_premium() and sender_type = 'member');
revoke update, delete on public.global_chat_messages from anon, authenticated;
grant select, insert on public.global_chat_messages to authenticated;

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_user_id uuid not null unique references public.profiles(id) on delete cascade,
  tier smallint not null check (tier between 1 and 3),
  status text not null default 'pending' check (status in ('pending','qualified','rejected')),
  created_at timestamptz not null default now()
);
alter table public.referrals enable row level security;
drop policy if exists "premium referrals read" on public.referrals;
create policy "premium referrals read"
on public.referrals for select to authenticated
using ((auth.uid() = referrer_id and public.mova_is_premium()) or public.mova_is_admin());
revoke insert, update, delete on public.referrals from anon, authenticated;

create table if not exists public.loan_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_kobo bigint not null check (amount_kobo > 0),
  tenure_months integer not null check (tenure_months between 1 and 60),
  monthly_income_kobo bigint not null check (monthly_income_kobo >= 0),
  employment_status text not null,
  status text not null default 'pending' check (status in ('pending','reviewing','approved','rejected')),
  created_at timestamptz not null default now()
);
alter table public.loan_applications enable row level security;
drop policy if exists "premium loans read own" on public.loan_applications;
drop policy if exists "premium loans insert own" on public.loan_applications;
create policy "premium loans read own"
on public.loan_applications for select to authenticated
using ((auth.uid() = user_id and public.mova_is_premium()) or public.mova_is_admin());
create policy "premium loans insert own"
on public.loan_applications for insert to authenticated
with check (auth.uid() = user_id and public.mova_is_premium() and status = 'pending');
revoke update, delete on public.loan_applications from anon, authenticated;

create table if not exists public.talking_stage_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid not null references public.profiles(id) on delete cascade,
  message_count integer not null default 0 check (message_count >= 0),
  active_days integer not null default 0 check (active_days >= 0),
  status text not null default 'active' check (status in ('active','pending_review','approved','rejected')),
  created_at timestamptz not null default now(),
  unique (user_id, partner_id),
  check (user_id <> partner_id)
);
alter table public.talking_stage_sessions enable row level security;
drop policy if exists "premium talking stage read" on public.talking_stage_sessions;
create policy "premium talking stage read"
on public.talking_stage_sessions for select to authenticated
using (((auth.uid() = user_id or auth.uid() = partner_id) and public.mova_is_premium()) or public.mova_is_admin());
revoke insert, update, delete on public.talking_stage_sessions from anon, authenticated;

-- Welcome bonus stays a separate, non-withdrawable ledger entry.
-- This function is safe to call repeatedly: the unique idempotency key prevents duplicates.
create or replace function public.mova_grant_welcome_bonus(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() <> p_user_id and not public.mova_is_admin() then
    raise exception 'Not authorised';
  end if;

  insert into public.wallet_ledger (
    user_id, activity_type, amount_kobo, status, idempotency_key, metadata
  )
  values (
    p_user_id,
    'welcome_bonus',
    910000,
    'approved',
    'welcome-bonus:' || p_user_id::text,
    jsonb_build_object('withdrawable', false, 'display_label', 'Welcome Bonus')
  )
  on conflict (idempotency_key) do nothing;
end;
$$;
revoke all on function public.mova_grant_welcome_bonus(uuid) from public;
grant execute on function public.mova_grant_welcome_bonus(uuid) to authenticated;

-- Trigger grants the bonus once for each newly created profile.
create or replace function public.mova_profile_welcome_bonus()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.mova_grant_welcome_bonus(new.id);
  return new;
end;
$$;
drop trigger if exists mova_profile_welcome_bonus_trigger on public.profiles;
create trigger mova_profile_welcome_bonus_trigger
after insert on public.profiles
for each row execute function public.mova_profile_welcome_bonus();


-- Create the MOVA profile automatically after Supabase Auth registration.
-- The profile trigger above then grants the separate non-withdrawable welcome bonus.
create or replace function public.mova_handle_new_auth_user()
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
  v_full_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'MOVA Member');
  v_username := lower(coalesce(
    nullif(regexp_replace(trim(new.raw_user_meta_data ->> 'username'), '[^a-zA-Z0-9_]', '', 'g'), ''),
    'mova_' || substr(replace(new.id::text, '-', ''), 1, 8)
  ));
  v_referral_code := 'MOVA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.profiles (
    id, full_name, username, phone, country, role, membership_status, referral_code
  )
  values (
    new.id,
    v_full_name,
    v_username,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'country'), ''), 'Nigeria'),
    'user',
    'standard',
    v_referral_code
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists mova_auth_user_profile_trigger on auth.users;
create trigger mova_auth_user_profile_trigger
after insert on auth.users
for each row execute function public.mova_handle_new_auth_user();


-- Note: this migration does not create a withdrawable wallet balance. The welcome
-- bonus is a separate ledger item with metadata.withdrawable=false. Withdrawal
-- endpoints must only select approved, withdrawable earnings, never this activity_type.
