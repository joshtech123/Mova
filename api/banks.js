export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: 'Bank verification is not configured.' });
  try {
    const upstream = await fetch('https://api.paystack.co/bank?country=nigeria&perPage=200', {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const payload = await upstream.json();
    if (!upstream.ok || !payload.status || !Array.isArray(payload.data)) {
      return res.status(502).json({ error: payload.message || 'Could not load the official bank list.' });
    }
    const banks = payload.data
      .filter((bank) => bank && bank.name && bank.code && bank.currency === 'NGN' && bank.active !== false)
      .map((bank) => ({ name: bank.name, code: String(bank.code), slug: bank.slug || '' }));
    return res.status(200).json({ banks });
  } catch {
    return res.status(502).json({ error: 'Paystack bank directory is temporarily unavailable.' });
  }
}
