# MOVA Premium database security

## Apply this migration

1. Open Supabase Dashboard → SQL Editor.
2. Run `supabase/002_premium_rls.sql` only after the existing `supabase/schema.sql` has been applied.
3. Do not expose the Supabase service-role key in Vercel frontend variables or browser code.

## What it enforces

- Premium checks happen inside PostgreSQL, not only in the React navigation.
- Standard members cannot read or write Premium-only chat, referrals, loans, talking-stage or game records.
- A member cannot promote their own profile to admin or set their own membership to Premium through the profile update policy.
- Members cannot approve payments or create/edit wallet ledger credits.
- Payment confirmation, membership activation, referral commissions, reward approvals and withdrawals must be performed by trusted server-side code.
- The ₦9,100 Welcome Bonus is stored as a separate `welcome_bonus` ledger entry with `withdrawable=false` and a unique idempotency key. It is not a withdrawable wallet balance.

## Important limitations

This migration secures the database tables and permissions. It does not by itself connect every existing React page to these tables or implement server endpoints. Existing mock/demo UI data must not be treated as real member records or real earnings.

For a production admin, assign the `role=admin` claim only in Supabase Auth `app_metadata` through a trusted admin process. Never set it from client-side profile data.
