# MOVA production setup and operations

## What this update adds

- Server-backed Premium payment submissions with a required transfer reference and receipt upload.
- Private Supabase Storage bucket `mova-payment-proofs` for receipts.
- Protected admin API. Every admin request validates the Supabase access token, checks `profiles.role = 'admin'`, and restricts the owner dashboard to the verified `movadigital87@gmail.com` account.
- Admin dashboard reachable from the member sidebar for the authorised admin, backed by real Supabase records: members, Premium payment submissions, withdrawals, referral relationships, recorded commissions, loan applications, wallet ledger and audit history.
- Server-side Premium approval. A member becomes Premium only after an administrator confirms the actual bank credit.
- Server-side withdrawal creation. The database checks Premium status and the selected wallet balance, records the bank details, creates a ledger debit and creates a `processing` request atomically.
- Admin payout completion and rejection. Rejection creates a refund ledger entry; completion is an explicit admin decision after the transfer has been sent.
- ₦9,100 welcome bonus issued once per member through an idempotent ledger key. Free members cannot withdraw; Premium members can.
- Signup referral-code attribution stored on the member profile.
- Loan applications saved to Supabase for review.
- Pinned MOVA Telegram announcement-channel card: https://t.me/Movaofficials1.
- No Telegram DM is used for Premium payment submission. No Paystack bank account lookup is used.

## Supabase and Vercel configuration

Frontend variables (safe for browser use):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Server-only Vercel variable:
- `SUPABASE_SERVICE_ROLE_KEY`

Keep the service-role key out of frontend code, `.env.example` values, GitHub, screenshots and chat. Do not prefix it with `VITE_`.

Optional AI variable:
- `OPENAI_API_KEY`

## Database migration

1. Confirm the existing MOVA Supabase project is the intended project.
2. Review `supabase/migrations/20261122_mova_core_operations.sql` before execution.
3. Run that single migration in the existing Supabase SQL Editor only after you approve it.
4. Do not run the legacy SQL files under `supabase/archive/`. They are retained for reference only.
5. The migration is additive: it creates operational tables and server functions, adds profile columns, creates a private receipt bucket, normalizes one welcome-bonus ledger credit per existing profile, and assigns the verified `movadigital87@gmail.com` account the admin role if that Auth user already exists.
6. Existing `supabase/schema.sql` and `supabase/002_premium_rls.sql` are preserved by this update. Existing RLS policies are not dropped or rewritten. The new operational tables are accessed by the server API using the service-role key after authentication and role checks.

If `movadigital87@gmail.com` does not yet exist as a verified Supabase Auth user when the migration runs, register and verify that account, then ask for a separate reviewed admin-role SQL statement. Do not change the email or grant admin access from the browser.

## Admin dashboard

Open `/admin` while signed in as `movadigital87@gmail.com`. The page is only a UI gate. The API independently validates the Supabase JWT and the database admin role before returning data or accepting an approval action.

Admin actions:
- Premium payments: inspect submitted receipt and transfer reference; confirm only after checking the receiving bank account, or reject with a reason.
- Withdrawals: view the member's submitted bank details; mark paid only after an actual transfer, or reject with a reason and trigger a ledger refund.
- Members: inspect registration and membership status.
- Referrals: inspect signup attribution separately from commission records. No commission is invented or automatically credited by this update because the active referral payout amounts need final confirmation.
- Loans: inspect applications. Approval/disbursement is not automated and remains subject to a real lending and affordability process.
- Wallet ledger and audit log: inspect actual records and admin decisions.

## Welcome bonus and withdrawal rules

- Each member receives one ₦9,100 `welcome_bonus` ledger credit.
- The bonus appears in the wallet for free members but cannot be withdrawn until `profiles.membership_status = 'premium'`.
- The server-side withdrawal RPC checks Premium status and the selected wallet balance. Frontend state alone cannot bypass it.
- A request is stored as `processing`; the negative ledger debit is written in the same database transaction. The member transaction history follows the withdrawal request status, so a reserved debit does not appear as a completed payout while the request is still processing.
- If an admin rejects it, a matching refund ledger credit is written. If marked completed, it is treated as paid. Admins must only mark completed after sending the money.

## Important limitations

- This update does not connect to a bank transaction feed. A human administrator must independently confirm the incoming Premium payment and outgoing withdrawal.
- Referral signup attribution is recorded. Referral commission values and automatic payouts remain disabled until the owner confirms the current commission schedule. The existing source has conflicting direct-commission figures, so no amount is guessed.
- Loan applications are stored for review; no loan is automatically approved or disbursed.
- Cash rewards for task, quiz, video, game or AI-chat activity are not made real by this update. Each reward source still needs server-side eligibility, anti-abuse controls and funding approval before being credited.
- A successful production build has not yet been verified in this environment because dependency installation did not complete.

## MOVA payment details

- Account name: MOVA DIGITAL HUB
- Account number: 3004611364
- Bank: KUDA MICROFINANCE BANK
- Premium upgrade: ₦12,000

## MOVA official Telegram channel

https://t.me/Movaofficials1

This is an announcement channel, not a payment-support inbox. The member dashboard links to it as the pinned official community channel.
