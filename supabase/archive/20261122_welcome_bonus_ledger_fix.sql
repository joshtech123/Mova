-- MOVA wallet correction: make the ₦9,100 welcome bonus withdrawable and ledger-backed.
-- Safe to run more than once. Each profile receives one approved credit only.
alter table public.profiles
  add column if not exists welcome_bonus_kobo bigint not null default 910000;

insert into public.wallet_ledger (
  user_id, activity_type, amount_kobo, status, idempotency_key, metadata
)
select
  p.id, 'welcome_bonus', 910000, 'approved',
  'welcome-bonus:' || p.id::text,
  jsonb_build_object('description', 'MOVA welcome bonus', 'wallet_source', 'welcome_pack')
from public.profiles p
on conflict (idempotency_key) do nothing;

create or replace function public.credit_mova_welcome_bonus()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallet_ledger (
    user_id, activity_type, amount_kobo, status, idempotency_key, metadata
  ) values (
    new.id, 'welcome_bonus', 910000, 'approved',
    'welcome-bonus:' || new.id::text,
    jsonb_build_object('description', 'MOVA welcome bonus', 'wallet_source', 'welcome_pack')
  ) on conflict (idempotency_key) do nothing;
  return new;
end;
$$;

drop trigger if exists mova_credit_welcome_bonus on public.profiles;
create trigger mova_credit_welcome_bonus
after insert on public.profiles
for each row execute function public.credit_mova_welcome_bonus();

-- Keep profile field for legacy display compatibility; wallet value comes from ledger.
