-- MOVA core operations migration
-- Additive and idempotent. Does not drop or replace existing RLS policies.
-- Review this file before running it in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Private bucket for member-submitted Premium payment receipts. Uploads are
-- written by the authenticated server API using the service-role key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mova-payment-proofs', 'mova-payment-proofs', false, 5242880, array['image/jpeg','image/png','application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;

alter table public.profiles
  add column if not exists welcome_bonus_kobo bigint not null default 910000,
  add column if not exists referred_by uuid references public.profiles(id),
  add column if not exists premium_activated_at timestamptz;

-- Premium payments are retained as a reviewable payment queue.
create table if not exists public.premium_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_kobo bigint not null default 1200000 check (amount_kobo = 1200000),
  transfer_reference text not null,
  proof_path text,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  admin_notes text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, transfer_reference)
);

alter table public.premium_payments add column if not exists proof_path text;
alter table public.premium_payments add column if not exists admin_notes text;

create table if not exists public.withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_kobo bigint not null check (amount_kobo > 0),
  wallet_source text not null check (wallet_source in ('task','referral','welcome_pack')),
  bank_name text not null,
  account_number text not null check (account_number ~ '^[0-9]{10}$'),
  account_name text not null,
  status text not null default 'processing' check (status in ('processing','completed','rejected')),
  admin_notes text,
  processed_by uuid references public.profiles(id),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.referral_commissions (
  id uuid primary key default gen_random_uuid(),
  referrer_user_id uuid not null references public.profiles(id) on delete cascade,
  referred_user_id uuid not null references public.profiles(id) on delete cascade,
  tier smallint not null check (tier in (1,2)),
  amount_kobo bigint not null check (amount_kobo >= 0),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  source_payment_id uuid references public.premium_payments(id),
  created_at timestamptz not null default now(),
  unique (referred_user_id, tier)
);

create table if not exists public.loan_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_kobo bigint not null check (amount_kobo > 0),
  tenure_months integer not null check (tenure_months > 0),
  monthly_income_kobo bigint,
  employment_status text,
  bank_name text not null,
  account_number text not null check (account_number ~ '^[0-9]{10}$'),
  account_name text not null,
  purpose text,
  status text not null default 'pending' check (status in ('pending','under_review','approved','rejected','disbursed','repaid')),
  admin_notes text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- The earlier premium migration created a smaller loan table. Add the fields
-- required by the review workflow without replacing the table or its RLS policies.
alter table public.loan_applications
  add column if not exists bank_name text,
  add column if not exists account_number text,
  add column if not exists account_name text,
  add column if not exists purpose text,
  add column if not exists admin_notes text,
  add column if not exists reviewed_by uuid references public.profiles(id),
  add column if not exists reviewed_at timestamptz;

alter table public.loan_applications drop constraint if exists loan_applications_status_check;
alter table public.loan_applications
  add constraint loan_applications_status_check
  check (status in ('pending','reviewing','under_review','approved','rejected','disbursed','repaid'));

create table if not exists public.mova_admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.mova_platform_settings (
  setting_key text primary key,
  setting_value jsonb not null,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

alter table public.premium_payments enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.referral_commissions enable row level security;
alter table public.loan_applications enable row level security;
alter table public.mova_admin_audit_log enable row level security;
alter table public.mova_platform_settings enable row level security;

-- Existing policies are deliberately not dropped or modified. Server routes use
-- the service-role key only after validating the member JWT and admin role.

-- Protect privileged profile columns even though the existing owner-profile
-- update policy permits members to edit their own profile row. Server-role writes
-- remain available to the trusted API and reviewed database functions.
create or replace function public.mova_protect_privileged_profile_fields()
returns trigger language plpgsql set search_path = public as $$
begin
  if coalesce(auth.role(), '') not in ('service_role','supabase_auth_admin') and current_user not in ('postgres','supabase_admin') then
    if new.role is distinct from old.role
      or new.membership_status is distinct from old.membership_status
      or new.welcome_bonus_kobo is distinct from old.welcome_bonus_kobo
      or new.referral_code is distinct from old.referral_code
      or new.referred_by is distinct from old.referred_by
      or new.premium_activated_at is distinct from old.premium_activated_at then
      raise exception 'Protected MOVA profile fields can only be changed by authorised server operations';
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists mova_protect_privileged_profile_fields_trigger on public.profiles;
create trigger mova_protect_privileged_profile_fields_trigger before update on public.profiles
for each row execute function public.mova_protect_privileged_profile_fields();

-- Normalize welcome bonus ledger entries. Each member gets exactly one approved
-- ₦9,100 credit; withdrawal eligibility is enforced by the Premium check below.
insert into public.wallet_ledger (user_id, activity_type, amount_kobo, status, idempotency_key, metadata)
select p.id, 'welcome_bonus', 910000, 'approved', 'welcome-bonus:' || p.id::text,
       jsonb_build_object('description','MOVA welcome bonus','wallet_source','welcome_pack','withdrawable_after_premium',true)
from public.profiles p
on conflict (idempotency_key) do update
set metadata = coalesce(public.wallet_ledger.metadata, '{}'::jsonb) || excluded.metadata;

-- One authoritative profile trigger for new-member welcome credits. Older trigger
-- names are removed to prevent duplicate trigger execution; no RLS policy is touched.
create or replace function public.mova_issue_welcome_bonus_once()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallet_ledger (user_id, activity_type, amount_kobo, status, idempotency_key, metadata)
  values (new.id, 'welcome_bonus', 910000, 'approved', 'welcome-bonus:' || new.id::text,
          jsonb_build_object('description','MOVA welcome bonus','wallet_source','welcome_pack','withdrawable_after_premium',true))
  on conflict (idempotency_key) do nothing;
  return new;
end; $$;

drop trigger if exists mova_profile_welcome_bonus_trigger on public.profiles;
drop trigger if exists mova_credit_welcome_bonus on public.profiles;
drop trigger if exists mova_issue_welcome_bonus_once_trigger on public.profiles;
create trigger mova_issue_welcome_bonus_once_trigger after insert on public.profiles
for each row execute function public.mova_issue_welcome_bonus_once();

-- Preserve referral attribution at signup by resolving the inviter's referral code.
create or replace function public.mova_create_profile_after_signup()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_full_name text;
  v_username text;
  v_referral_code text;
  v_referrer_id uuid;
begin
  v_full_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(new.email, 'mova@member.local'), '@', 1));
  v_username := lower(coalesce(nullif(regexp_replace(trim(coalesce(new.raw_user_meta_data ->> 'username', '')), '[^a-zA-Z0-9_]', '', 'g'), ''), 'mova_' || substr(replace(new.id::text, '-', ''), 1, 8)));
  v_referral_code := 'MOVA-' || upper(substr(replace(new.id::text, '-', ''), 1, 10));
  select id into v_referrer_id from public.profiles
    where upper(referral_code) = upper(trim(coalesce(new.raw_user_meta_data ->> 'referred_by', '')))
    limit 1;
  if v_referrer_id = new.id then v_referrer_id := null; end if;
  insert into public.profiles (id,full_name,username,phone,country,role,membership_status,referral_code,welcome_bonus_kobo,referred_by)
  values (new.id,v_full_name,v_username || '_' || substr(replace(new.id::text, '-', ''), 1, 5),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'country'), ''), 'Nigeria'),
    case when lower(new.email) = 'movadigital87@gmail.com' and new.email_confirmed_at is not null then 'admin' else 'user' end,
    'standard',v_referral_code,910000,v_referrer_id)
  on conflict (id) do update set referred_by = coalesce(public.profiles.referred_by, excluded.referred_by);
  return new;
end; $$;

drop trigger if exists on_mova_auth_user_created on auth.users;
drop trigger if exists mova_auth_user_profile_trigger on auth.users;
create trigger mova_auth_user_profile_trigger after insert on auth.users
for each row execute function public.mova_create_profile_after_signup();

-- Promote the specified owner only if that exact email already exists and is verified.
update public.profiles p set role = 'admin'
from auth.users u
where u.id = p.id and lower(u.email) = 'movadigital87@gmail.com' and u.email_confirmed_at is not null;

create or replace function public.mova_promote_verified_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(coalesce(new.email,'')) = 'movadigital87@gmail.com' and new.email_confirmed_at is not null then
    update public.profiles set role='admin' where id=new.id;
  end if;
  return new;
end; $$;
drop trigger if exists mova_promote_verified_owner_trigger on auth.users;
create trigger mova_promote_verified_owner_trigger after update of email_confirmed_at on auth.users
for each row execute function public.mova_promote_verified_owner();

-- Atomic member withdrawal request. Ledger debit and request are committed together.
create or replace function public.mova_request_withdrawal(
  p_user_id uuid, p_amount_kobo bigint, p_wallet_source text,
  p_bank_name text, p_account_number text, p_account_name text
) returns public.withdrawal_requests
language plpgsql security definer set search_path = public as $$
declare
  v_profile public.profiles%rowtype;
  v_balance bigint;
  v_request public.withdrawal_requests%rowtype;
  v_activity text;
begin
  select * into v_profile from public.profiles where id = p_user_id for update;
  if not found then raise exception 'Member profile not found'; end if;
  if v_profile.membership_status <> 'premium' then raise exception 'Upgrade to MOVA Premium before withdrawing'; end if;
  if p_amount_kobo is null or p_amount_kobo < 500000 then raise exception 'Minimum withdrawal amount is ₦5,000'; end if;
  if p_wallet_source not in ('task','referral','welcome_pack') then raise exception 'Invalid wallet source'; end if;
  if p_bank_name is null or length(trim(p_bank_name)) = 0 or p_account_number !~ '^[0-9]{10}$' or p_account_name is null or length(trim(p_account_name)) = 0 then
    raise exception 'Enter valid bank and account details';
  end if;

  select coalesce(sum(amount_kobo),0) into v_balance
  from public.wallet_ledger
  where user_id = p_user_id and status = 'approved'
    and case p_wallet_source
      when 'welcome_pack' then activity_type = 'welcome_bonus' or metadata->>'wallet_source' = 'welcome_pack'
      when 'referral' then activity_type in ('referral_direct','referral_indirect_1','referral_indirect_2') or metadata->>'wallet_source' = 'referral'
      else activity_type not in ('referral_direct','referral_indirect_1','referral_indirect_2','welcome_bonus') and coalesce(metadata->>'wallet_source','task') = 'task'
    end;
  if p_amount_kobo > v_balance then raise exception 'Insufficient balance in selected wallet'; end if;

  insert into public.withdrawal_requests(user_id,amount_kobo,wallet_source,bank_name,account_number,account_name,status)
  values(p_user_id,p_amount_kobo,p_wallet_source,trim(p_bank_name),p_account_number,trim(p_account_name),'processing')
  returning * into v_request;

  v_activity := 'withdrawal_' || p_wallet_source;
  insert into public.wallet_ledger(user_id,activity_type,amount_kobo,status,idempotency_key,metadata)
  values(p_user_id,v_activity,-p_amount_kobo,'approved','withdrawal:' || v_request.id::text,
         jsonb_build_object('description','Withdrawal request','wallet_source',p_wallet_source,'withdrawal_id',v_request.id,'bank_name',trim(p_bank_name),'account_number',p_account_number,'account_name',trim(p_account_name)));
  return v_request;
end; $$;

-- Admin review of Premium payments. Approval is the only operation that activates Premium.
create or replace function public.mova_admin_review_premium(
  p_admin_id uuid, p_payment_id uuid, p_decision text, p_notes text default null
) returns public.premium_payments
language plpgsql security definer set search_path = public as $$
declare v_admin public.profiles%rowtype; v_payment public.premium_payments%rowtype;
begin
  select * into v_admin from public.profiles where id=p_admin_id and role='admin';
  if not found then raise exception 'Admin access required'; end if;
  select * into v_payment from public.premium_payments where id=p_payment_id for update;
  if not found or v_payment.status <> 'pending' then raise exception 'Pending payment not found'; end if;
  if p_decision is null or p_decision not in ('confirmed','rejected') then raise exception 'Invalid decision'; end if;
  update public.premium_payments set status=p_decision, admin_notes=p_notes, verified_by=p_admin_id, verified_at=now()
  where id=p_payment_id returning * into v_payment;
  if p_decision='confirmed' then
    update public.profiles set membership_status='premium', premium_activated_at=now() where id=v_payment.user_id;
  end if;
  insert into public.mova_admin_audit_log(admin_user_id,action,entity_type,entity_id,details)
  values(p_admin_id,'premium_payment_'||p_decision,'premium_payment',p_payment_id,jsonb_build_object('member_id',v_payment.user_id,'notes',p_notes));
  return v_payment;
end; $$;

-- Admin marks a payout completed only after the transfer is actually sent, or rejects it
-- and reverses the original debit back into the same wallet.
create or replace function public.mova_admin_review_withdrawal(
  p_admin_id uuid, p_withdrawal_id uuid, p_decision text, p_notes text default null
) returns public.withdrawal_requests
language plpgsql security definer set search_path = public as $$
declare v_admin public.profiles%rowtype; v_item public.withdrawal_requests%rowtype;
begin
  select * into v_admin from public.profiles where id=p_admin_id and role='admin';
  if not found then raise exception 'Admin access required'; end if;
  select * into v_item from public.withdrawal_requests where id=p_withdrawal_id for update;
  if not found or v_item.status <> 'processing' then raise exception 'Processing withdrawal not found'; end if;
  if p_decision is null or p_decision not in ('completed','rejected') then raise exception 'Invalid decision'; end if;
  update public.withdrawal_requests set status=p_decision, admin_notes=p_notes, processed_by=p_admin_id, processed_at=now()
  where id=p_withdrawal_id returning * into v_item;
  if p_decision='rejected' then
    insert into public.wallet_ledger(user_id,activity_type,amount_kobo,status,idempotency_key,metadata)
    values(v_item.user_id,'withdrawal_refund_'||v_item.wallet_source,v_item.amount_kobo,'approved','withdrawal-refund:'||v_item.id::text,
           jsonb_build_object('description','Withdrawal refund','wallet_source',v_item.wallet_source,'withdrawal_id',v_item.id));
  end if;
  insert into public.mova_admin_audit_log(admin_user_id,action,entity_type,entity_id,details)
  values(p_admin_id,'withdrawal_'||p_decision,'withdrawal',p_withdrawal_id,jsonb_build_object('member_id',v_item.user_id,'amount_kobo',v_item.amount_kobo,'notes',p_notes));
  return v_item;
end; $$;

create or replace function public.mova_admin_review_loan(
  p_admin_id uuid, p_loan_id uuid, p_decision text, p_notes text default null
) returns public.loan_applications
language plpgsql security definer set search_path = public as $$
declare v_admin public.profiles%rowtype; v_loan public.loan_applications%rowtype;
begin
  select * into v_admin from public.profiles where id=p_admin_id and role='admin';
  if not found then raise exception 'Admin access required'; end if;
  select * into v_loan from public.loan_applications where id=p_loan_id for update;
  if not found or v_loan.status not in ('pending','under_review','reviewing') then raise exception 'Open loan application not found'; end if;
  if p_decision is null or p_decision not in ('under_review','approved','rejected') then raise exception 'Invalid loan decision'; end if;
  update public.loan_applications set status=p_decision, admin_notes=p_notes, reviewed_by=p_admin_id, reviewed_at=now()
  where id=p_loan_id returning * into v_loan;
  insert into public.mova_admin_audit_log(admin_user_id,action,entity_type,entity_id,details)
  values(p_admin_id,'loan_'||p_decision,'loan_application',p_loan_id,jsonb_build_object('member_id',v_loan.user_id,'amount_kobo',v_loan.amount_kobo,'notes',p_notes));
  return v_loan;
end; $$;

-- Server-only functions: callers must first validate the Supabase JWT and admin role.
revoke all on function public.mova_request_withdrawal(uuid,bigint,text,text,text,text) from public, anon, authenticated;
revoke all on function public.mova_admin_review_premium(uuid,uuid,text,text) from public, anon, authenticated;
revoke all on function public.mova_admin_review_withdrawal(uuid,uuid,text,text) from public, anon, authenticated;
revoke all on function public.mova_admin_review_loan(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.mova_request_withdrawal(uuid,bigint,text,text,text,text) to service_role;
grant execute on function public.mova_admin_review_premium(uuid,uuid,text,text) to service_role;
grant execute on function public.mova_admin_review_withdrawal(uuid,uuid,text,text) to service_role;
grant execute on function public.mova_admin_review_loan(uuid,uuid,text,text) to service_role;
