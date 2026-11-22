# MOVA visual update

This update is a visual-only pass based on the supplied MOVA project ZIP.

## Updated
- Added layered texture, orbital rings, ambient colour glows and a moving light sweep to the public homepage hero.
- Added ambient mesh and blue/orange lighting behind the member dashboard.
- Added staggered dashboard entrance motion, richer card surfaces, hover lift, focus-visible states and deeper shadows.
- Tuned light and dark mode surfaces separately so both retain readable contrast.
- Added mobile sizing and reduced-motion fallbacks.

## Preserved
- Supabase client/authentication code, API routes, database SQL, page routing, membership gates, and existing business logic were not intentionally changed.
- Existing MOVA logo and supplied assets were not modified.

## Validation
- Source archive integrity was checked after packaging.
- A production build was not verified in this environment because dependency installation timed out. Run `npm install` and `npm run build` before production deployment, then review the Vercel build log.
