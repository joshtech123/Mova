# MOVA wallet and bank verification update

## What changed
- The ₦9,100 welcome bonus is credited once as an approved `wallet_ledger` entry.
- The dashboard no longer shows it as a separate non-withdrawable banner.
- The withdrawal page shows the welcome bonus as included in the available wallet funds.
- Financial balance and recent activity are loaded from the Supabase ledger API, not restored from browser localStorage.
- Browser-only fabricated transaction history updates were removed.
- Nigerian bank list and account-name verification use Paystack only for account verification, not for collecting member payments.
- Fixed the account-number validation regular expression in the account resolver.

## Required Supabase migration
Open Supabase > SQL Editor, open `supabase/migrations/20261122_welcome_bonus_ledger_fix.sql`, paste its contents, and run it once. It is safe to rerun. It credits existing profiles once and automatically credits future profiles once.

## Required Vercel environment variables
Keep the existing:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Add/confirm these as server-side **Secret** variables for Production:
- `SUPABASE_SERVICE_ROLE_KEY` = Supabase Project Settings > API Keys > `service_role` secret. Never use a `VITE_` prefix and never expose this value in frontend code or chat.
- `PAYSTACK_SECRET_KEY` = the rotated Paystack secret key. This is used only by `/api/banks` and `/api/resolve-account` for bank directory and account name resolution. It is not used to collect MOVA upgrade payments.

After saving environment variables, redeploy the Vercel Production deployment.

## Important limits
- The app now reads financial activity from `wallet_ledger`. Existing fake browser history is intentionally not imported or treated as money.
- Only approved ledger entries count toward balances. Pending, rejected, or reversed entries do not.
- The withdrawal request workflow itself still needs a server-side withdrawal-request table/API and admin review wiring before real payouts can be submitted safely. Do not treat a browser-side success toast as proof of payout.
- Build installation timed out in this environment, so a successful production build has not been verified here.
