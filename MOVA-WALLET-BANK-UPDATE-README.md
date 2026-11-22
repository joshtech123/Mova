# MOVA Withdrawal Update

- Free members cannot withdraw the ₦9,100 welcome bonus or other wallet funds. Clicking the withdrawal action opens a Premium upgrade prompt.
- Premium access is read from the authenticated profile membership status.
- Premium members can select task, referral, or welcome-bonus wallet balances. Requests cannot exceed the selected source balance.
- Bank details are entered manually: bank, 10-digit account number, and account holder name.
- Paystack bank-directory and account-name verification are not used by this withdrawal form.
- New requests are shown as **Processing**, not as paid or completed.
- The correct source wallet is debited when a request is created and restored if the existing admin rejection action is used.

## Important scope note
This update changes the existing React withdrawal flow only. It does not modify Supabase schema, migrations, RLS policies, or database records. Requests are not yet persisted to a shared server-side admin queue, so this is not the final production payout workflow. The admin dashboard and secure shared withdrawal backend are intentionally deferred to the next stage.
