# MOVA auth, routing and interface update

## Routes
- `/` homepage
- `/login` sign in
- `/create` registration
- `/forgot-password` password reset screen
- Member sections use readable paths such as `/dashboard`, `/videos`, `/upgrade`, `/profile`.
- `vercel.json` rewrites direct route requests to the Vite app so refreshes do not return 404.

## Registration without email confirmation
In Supabase Dashboard, open Authentication → Providers → Email and turn **Confirm email** OFF. MOVA does not send or request a phone OTP. Email remains the account's login identifier, but confirmation is disabled as requested.

If Confirm email remains enabled, Supabase will return a user without an active session and MOVA will display a clear setup error instead of pretending the account is ready.

## Interface changes
- Removed the Live Demo Dashboard CTA.
- Removed the demo OTP/123456 verification screen.
- Replaced sample personal-looking placeholders with neutral prompts and disabled browser autofill on registration.
- Added theme toggle on homepage, auth screens and member navbar, using saved light/dark preference.
- Added restrained animated hero lighting, floating background orbs, entrance motion and hover lift effects.
- Improved mobile spacing and restored accessible pinch zoom.
