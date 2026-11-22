// Server-side, authenticated wallet snapshot. Requires SUPABASE_SERVICE_ROLE_KEY in Vercel.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = String(req.headers.authorization || '').replace(/^Bearer\\s+/i, '');
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return res.status(503).json({ error: 'Wallet service is not configured. Add the Supabase service role key in Vercel.' });
  }
  if (!token) return res.status(401).json({ error: 'Sign in required.' });
  try {
    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` }
    });
    const authUser = await authRes.json();
    if (!authRes.ok || !authUser.id) return res.status(401).json({ error: 'Your session has expired. Sign in again.' });

    const ledgerRes = await fetch(
      `${supabaseUrl}/rest/v1/wallet_ledger?user_id=eq.${encodeURIComponent(authUser.id)}&select=id,activity_type,amount_kobo,status,idempotency_key,metadata,created_at&order=created_at.desc&limit=100`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    );
    const rows = await ledgerRes.json();
    if (!ledgerRes.ok || !Array.isArray(rows)) return res.status(502).json({ error: 'Could not load your wallet ledger.' });

    const approved = rows.filter(r => r.status === 'approved');
    const toNaira = kobo => Number(kobo || 0) / 100;
    const sum = list => list.reduce((n, r) => n + Number(r.amount_kobo || 0), 0);
    const task = sum(approved.filter(r => !['referral_direct','referral_indirect_1','referral_indirect_2'].includes(r.activity_type)));
    const referral = sum(approved.filter(r => ['referral_direct','referral_indirect_1','referral_indirect_2'].includes(r.activity_type)));
    const welcome = sum(approved.filter(r => r.activity_type === 'welcome_bonus'));
    const total = sum(approved);
    const transactions = rows.map(r => ({
      id: r.id,
      userId: authUser.id,
      type: r.activity_type === 'welcome_bonus' ? 'welcome_pack' : r.activity_type,
      description: r.metadata?.description || String(r.activity_type || 'Wallet activity').replaceAll('_',' '),
      amount: toNaira(r.amount_kobo),
      wallet: r.metadata?.wallet_source || (r.activity_type === 'welcome_bonus' ? 'welcome_pack' : 'task'),
      status: r.status === 'approved' ? 'completed' : r.status,
      date: new Date(r.created_at).toLocaleString('en-NG'),
      reference: r.idempotency_key
    }));
    return res.status(200).json({
      wallet: {
        availableBalance: toNaira(total),
        taskBalance: toNaira(task),
        referralBalance: toNaira(referral),
        welcomePackBalance: toNaira(welcome),
        lifetimeEarnings: toNaira(approved.filter(r => r.amount_kobo > 0).reduce((n,r)=>n+Number(r.amount_kobo),0))
      },
      transactions
    });
  } catch {
    return res.status(502).json({ error: 'Wallet service is temporarily unavailable.' });
  }
}
