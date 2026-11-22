export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: 'Bank verification is not configured. Add PAYSTACK_SECRET_KEY in Vercel.' });

  const accountNumber = String(req.body?.accountNumber || '').trim();
  const bankCode = String(req.body?.bankCode || '').trim();
  const requestedBankName = String(req.body?.bankName || '').trim();

  if (!/^\d{10}$/.test(accountNumber)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit account number.' });
  }
  if (!bankCode || !requestedBankName) {
    return res.status(400).json({ error: 'Select a bank from the official bank list.' });
  }

  try {
    // Confirm the submitted bank code/name pair against Paystack's current bank directory.
    const banksResponse = await fetch('https://api.paystack.co/bank?country=nigeria&perPage=200', {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const banksPayload = await banksResponse.json();
    if (!banksResponse.ok || !banksPayload.status || !Array.isArray(banksPayload.data)) {
      return res.status(502).json({ error: 'Could not validate the selected bank with Paystack. Try again.' });
    }

    const bank = banksPayload.data.find((item) =>
      String(item.code) === bankCode &&
      String(item.name).toLowerCase() === requestedBankName.toLowerCase() &&
      item.currency === 'NGN' &&
      item.active !== false
    );
    if (!bank) {
      return res.status(400).json({ error: 'The selected bank does not match Paystack’s current bank directory. Refresh the bank list and try again.' });
    }

    const url = new URL('https://api.paystack.co/bank/resolve');
    url.searchParams.set('account_number', accountNumber);
    url.searchParams.set('bank_code', bankCode);
    const upstream = await fetch(url, { headers: { Authorization: `Bearer ${secret}` } });
    const payload = await upstream.json();

    if (!upstream.ok || !payload.status || !payload.data?.account_name) {
      return res.status(422).json({ error: payload.message || 'Paystack could not confirm this account. Check the account number and bank.' });
    }

    return res.status(200).json({
      accountName: String(payload.data.account_name).trim(),
      accountNumber,
      bankName: bank.name,
      bankCode: String(bank.code),
      provider: 'paystack'
    });
  } catch {
    return res.status(502).json({ error: 'Paystack account verification could not be reached. Please try again.' });
  }
}
