# MOVA project update and production setup

## Changes in this update
- Replaced the old Moniepoint placeholder on the Premium upgrade screen with the supplied MOVA Kuda account:
  - Account name: MOVA DIGITAL HUB
  - Account number: 3004611364
  - Bank: KUDA MICROFINANCE BANK
- Premium transfer submission no longer activates Premium automatically. It records a pending reference in the current browser only. Do not treat this local preview record as a payment confirmation.
- Removed the fake account-name generator. Withdrawal account lookup now calls `/api/resolve-account` on the server and returns the bank provider's confirmed name.
- Added a welcome popup and a 3-step getting-started guide: profile, bank details, Premium.
- Removed the email-contains-admin shortcut and the visible role-switch control. The admin page is restricted to accounts with an admin role in the application state.
- Added a dark theme toggle with neutral surface/text adjustments that preserve MOVA blue and orange accents.
- Kept the reflex and lucky-wheel mini-games playable. Wheel outcomes are now game badges/entries, not pretend cash credits.

## Required environment variable for account-name lookup
The account lookup endpoint uses Paystack's bank resolve API. Add this on Vercel:
- `PAYSTACK_SECRET_KEY` = your Paystack **secret** key

Keep this key server-side only. Never add it to a `VITE_` variable or frontend source. Use a Paystack test secret key for testing, then switch to the live key only after business verification and approval. Bank support depends on the bank code list in `api/resolve-account.js`.

If the key is missing, the endpoint deliberately returns a clear setup error. It will not invent account names.

## What is not live yet
This ZIP is not a fully connected production backend. The existing app still has browser-local demo authentication/state. Client-side task, quiz, click, talking-stage and referral cash-credit actions have been disabled until a secure server ledger is connected. The Premium transfer reference is saved to localStorage and is not shared with a separate admin device. No admin can safely verify a payment across devices until Supabase (or another database) and server-side authorization are connected.

The SQL foundation is in `supabase/schema.sql`. Create a Supabase project, run that SQL, and then connect the app's registration/login, member profiles, bank details, payment submissions, wallet ledger, task completion and admin review to Supabase server-side APIs. Do not launch real cash rewards until every credit is written to the server ledger with eligibility checks, daily limits, idempotency and admin review where required.

## Admin access
Do not create an admin by typing "admin" in an email address. The demo shortcut has been removed. In production, the platform owner must be authenticated through Supabase and assigned `app_metadata.role = "admin"` from a trusted server-side process. The admin dashboard must check that trusted role on every server request, not only hide a menu item in React.

## Payment confirmation
For bank transfers, verify the actual credit in the MOVA receiving account or through an approved bank/payment provider integration. Only then should the server mark `premium_payments.status = 'confirmed'`, update the member's `membership_status`, and write an audit record. Never activate based on a screenshot, browser redirect, or user-submitted reference alone.

## Build and deployment
- Framework: Vite + React + TypeScript
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Dependency installation was attempted in this environment but did not complete within the available execution window, so a successful production build has not been confirmed.


## Telegram payment confirmation
The Premium screen now opens Telegram after the member enters their transfer reference. It prefills the member's name, email, amount and reference and asks them to attach the bank receipt manually. Telegram links cannot attach a file automatically.
Configure `VITE_PAYMENT_SUPPORT_TELEGRAM` with the payment reviewer's Telegram username (without @) in Vercel. Do not invent a username. The receiving reviewer must independently confirm the Kuda account credit before Premium is enabled.

## MOVA AI support
A floating MOVA AI Assistant is included. It answers general platform questions only and cannot inspect member accounts or approve money movements. Configure `OPENAI_API_KEY` in Vercel to enable it. Keep it server-side, never expose it as a `VITE_` variable. `OPENAI_SUPPORT_MODEL` defaults to `gpt-5.5`. If the key is missing, the assistant clearly reports that it is not configured.

## Important current state
The old seeded Oakaka member session has been removed. The app starts signed out. Demo login and registration now fail closed with a message because Supabase Auth is not connected. This avoids inventing a member email or creating fake identities. The profile screen no longer pre-fills Oakaka's personal data.
The static fake "recent member activated" style notifications have been removed.
Loan submissions are disabled until a real backend, account verification and lending partner are connected. The loan page keeps its form/calculator presentation but will not claim an application was submitted.
The lucky wheel has a longer easing animation and badge/entry outcomes only. It does not credit cash.


## MOVA official Premium transfer details
- Account name: MOVA DIGITAL HUB
- Account number: 3004611364
- Bank: KUDA MICROFINANCE BANK
- Premium fee: ₦12,000

## Required owner configuration before deployment
1. In Paystack, open Dashboard → Settings → API Keys & Webhooks → API Configuration. Use the Test Secret Key for development. Paystack's documentation says secret keys belong on the server and must never be placed in frontend code.
2. In Vercel Project → Settings → Environment Variables, add `PAYSTACK_SECRET_KEY` for bank account name lookup.
3. Add `VITE_PAYMENT_SUPPORT_TELEGRAM` with the exact payment reviewer's Telegram username, without @. The app cannot know or invent this username.
4. Add `OPENAI_API_KEY` to enable the MOVA AI Assistant. This key must be server-only.
5. Add Supabase project URL and anon key only after the app's authentication and database integration is implemented. The current source still does not have live Supabase auth, cross-device payment queue, or server-side admin verification.

## Do not launch as a live money platform yet
The current front-end can demonstrate the user journey, but it is not production-connected. Payment proof is handed to a human reviewer through Telegram. There is no automatic Kuda transaction feed or bank webhook in this build. The admin cannot securely approve users across devices until the Supabase backend and protected admin API are implemented. Account-name lookup works only after a valid Paystack business API key is configured and the selected bank is supported.


## Security action: exposed Paystack test secret
A Paystack secret key was pasted into a chat. Treat it as exposed and rotate it immediately in Paystack Dashboard → Settings → API Keys & Webhooks. Generate a replacement test secret key and update the Vercel environment variable `PAYSTACK_SECRET_KEY`, then redeploy. Do not put the key in this ZIP, React code, GitHub, screenshots, or chat. The pasted key starts with `sk_test_`, so it is a test-mode key and is not the live production key.

## Bank account name lookup
The server endpoint `api/resolve-account.js` calls Paystack's `GET /bank/resolve` endpoint. It requires a 10-digit account number, a supported bank code and the server-side `PAYSTACK_SECRET_KEY`. It does not fabricate account names. If Paystack cannot resolve the account, the UI should show the provider's error. Paystack documents that this account resolution service is available to businesses in Nigeria and Ghana and returns the bank account name. See https://paystack.com/docs/api/verification/ and https://paystack.com/docs/developer-tools/api-keys/.

## Member chat and AI
The Global Chat UI no longer presents sample people as real online members. It shows an empty state until real members are loaded from a shared authenticated database. A single server-side OpenAI API key can power a clearly labelled AI assistant, but it must not be used to impersonate fictional profiles as real people. Real member-to-member chat requires Supabase Auth, member profiles, and Supabase Realtime (or another authenticated messaging backend).

## Admin dashboard visibility
The member-facing Admin Panel links have been removed from the public navigation. This is only UI hiding, not a security boundary. Do not use client-side role flags as the only protection. For a separate admin URL without buying another domain, deploy the admin app as a separate Vercel project and use its free `*.vercel.app` hostname, then enforce server-side admin authentication and database row-level security. A separate URL alone does not secure the admin data.


## Bank verification update (Nov 18)
The withdrawal form now loads the bank directory directly from Paystack through `/api/banks`. It submits the selected bank's current Paystack bank code, not a hard-coded code mapping. `/api/resolve-account` checks that the bank name/code pair exists in Paystack's current Nigerian bank directory before resolving the account number. The UI invalidates a previous verification whenever the account number or bank selection changes and requires the current pair to be verified again.
A returned name is the name Paystack reports for that account number and bank code. If it is not the intended account holder, the member must not submit a payout. Do not override or manually edit a returned name. If the correct account number and bank still return another person's name, contact Paystack support and check the account with the bank. Do not pay out until resolved.

## MOVA AI Chat
The active Global Chat route has been changed to a clearly labelled MOVA AI Chat. It uses one server-side OpenAI API key for the application, not individual keys per member. The key must be stored as `OPENAI_API_KEY` in Vercel Environment Variables and must never be placed in browser code or this ZIP. The default model is `gpt-4.1-mini`; optionally set `OPENAI_CHAT_MODEL` to another model available to your API project.
AI conversations do not earn the old human-to-human chat reward. AI is not a real member, and AI replies must not be presented as human members. This chat is a UI/API integration only; conversation history is held in the current browser session and is not a shared real-time member chat.

## Security
The OpenAI key posted in the conversation should be revoked immediately and replaced. Do not reuse it. The Paystack key previously pasted in chat should also be rotated. Store both replacement keys only in Vercel Environment Variables. Set them as server-only names (`OPENAI_API_KEY`, `PAYSTACK_SECRET_KEY`) with no `VITE_` prefix.
