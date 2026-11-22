# MOVA Premium Access Gate

This update adds a frontend route gate for the following Premium-only pages:
- Global Chat
- Referral
- Talking Stage
- Loans

For a standard member, direct navigation to one of these pages is intercepted and the app shows the Premium Upgrade page instead. The sidebar also marks these entries as Premium-locked.

Important security limitation:
This is a user-interface gate only. It does not replace Supabase Row Level Security or server-side authorization. Before MOVA is used with real member data or money, the same membership checks must be enforced by database policies and trusted server endpoints. Do not treat a hidden page as backend security.

The dashboard's ₦9,100 Welcome Bonus remains displayed as a separate, non-withdrawable benefit. It must not be included in available balance or withdrawal calculations.
