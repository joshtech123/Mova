-- MOVA production data foundation (Supabase PostgreSQL)
-- Run in Supabase SQL Editor after creating the project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique not null,
  phone text,
  country text default 'Nigeria',
  role text not null default 'user' check (role in ('user','admin')),
  membership_status text not null default 'standard' check (membership_status in ('standard','premium')),
  referral_code text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.member_bank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bank_name text not null,
  bank_code text not null,
  account_number text not null,
  account_name text not null,
  verified_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.premium_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_kobo bigint not null check (amount_kobo = 1200000),
  transfer_reference text not null unique,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_type text not null,
  amount_kobo bigint not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','reversed')),
  idempotency_key text not null unique,
  metadata jsonb not null default '{}'::jsonb,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_code text not null,
  score integer not null default 0,
  completed_at timestamptz not null default now(),
  reward_ledger_id uuid references public.wallet_ledger(id)
);

alter table public.profiles enable row level security;
alter table public.member_bank_accounts enable row level security;
alter table public.premium_payments enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.game_sessions enable row level security;

-- Members may read/update only their own profile.
create policy "profile read own" on public.profiles for select using (auth.uid() = id);
create policy "profile update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "bank read own" on public.member_bank_accounts for select using (auth.uid() = user_id);
create policy "bank insert own" on public.member_bank_accounts for insert with check (auth.uid() = user_id);
create policy "payment read own" on public.premium_payments for select using (auth.uid() = user_id);
create policy "payment insert own" on public.premium_payments for insert with check (auth.uid() = user_id);
create policy "ledger read own" on public.wallet_ledger for select using (auth.uid() = user_id);
create policy "game read own" on public.game_sessions for select using (auth.uid() = user_id);
create policy "game insert own" on public.game_sessions for insert with check (auth.uid() = user_id);

-- IMPORTANT:
-- Never allow clients to update membership_status, wallet balances, ledger approvals,
-- or payment status directly. Do those in server-side functions after provider/admin verification.
-- Promote the real owner account to admin using Supabase Auth app_metadata from a trusted
-- server-side admin script, not a client-side role selector.
