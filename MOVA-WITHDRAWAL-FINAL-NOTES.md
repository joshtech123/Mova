# MOVA withdrawal update

This package contains the Premium-gated withdrawal UI and local app-state workflow, manual bank details, Processing status, and corrected wallet category calculation.

## Wallet category calculation
- Task wallet excludes referral activities and `welcome_bonus`.
- Referral wallet includes only `referral_direct`, `referral_indirect_1`, and `referral_indirect_2`.
- Welcome wallet includes only `welcome_bonus`.

## Supabase preservation
No Supabase SQL, migration, schema, or RLS files were edited for this correction. The Supabase files are carried over unchanged from the supplied MOVA source ZIP. Adding a migration file to a repository does not execute it in Supabase.

## Important limitation
Withdrawal requests in this stage are stored in the app's existing client-side state/local persistence. They are not yet written to a shared server-side admin queue. The admin dashboard/backend queue is a separate stage.

## Deployment
Keep the Vercel Root Directory set to `Mova-main`. Upload the contents of the `Mova-main` folder, without creating an extra nested `Mova-main` directory.
