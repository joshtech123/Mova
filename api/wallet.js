// Authenticated wallet snapshot. The service-role key is server-only.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!supabaseUrl || !anonKey || !serviceKey) return res.status(503).json({ error: 'Wallet service is not configured. Add SUPABASE_SERVICE_ROLE_KEY to Vercel server environment variables.' });
  if (!token) return res.status(401).json({ error: 'Sign in required.' });
  try {
    const authRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } });
    const authUser = await authRes.json();
    if (!authRes.ok || !authUser.id) return res.status(401).json({ error: 'Your session has expired. Sign in again.' });

    const base = `${supabaseUrl.replace(/\/$/, '')}/rest/v1`;
    const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
    async function fetchAll(path, optional = false) {
      const all = [];
      for (let start = 0; ; start += 1000) {
        const response = await fetch(`${base}${path}`, { headers: { ...headers, Range: `${start}-${start + 999}` } });
        const rows = await response.json();
        if (!response.ok || !Array.isArray(rows)) { if (optional && start === 0) return []; throw new Error('Could not load wallet records.'); }
        all.push(...rows);
        if (rows.length < 1000) break;
      }
      return all;
    }
    const userFilter = `?user_id=eq.${encodeURIComponent(authUser.id)}`;
    const [rows, withdrawalRows, loanRows] = await Promise.all([
      fetchAll(`/wallet_ledger${userFilter}&select=id,activity_type,amount_kobo,status,idempotency_key,metadata,created_at&order=created_at.asc`),
      fetchAll(`/withdrawal_requests${userFilter}&select=id,amount_kobo,wallet_source,bank_name,account_number,account_name,status,admin_notes,created_at&order=created_at.desc`, true),
      fetchAll(`/loan_applications${userFilter}&select=id,amount_kobo,tenure_months,monthly_income_kobo,employment_status,bank_name,account_number,account_name,status,created_at&order=created_at.desc`, true),
    ]);
    const approved = rows.filter(r => r.status === 'approved');
    const toNaira = kobo => Number(kobo || 0) / 100;
    const sum = list => list.reduce((n, r) => n + Number(r.amount_kobo || 0), 0);
    const isReferral = r => ['referral_direct','referral_indirect_1','referral_indirect_2'].includes(r.activity_type) || r.metadata?.wallet_source === 'referral';
    const isWelcome = r => r.activity_type === 'welcome_bonus' || r.metadata?.wallet_source === 'welcome_pack';
    const task = approved.filter(r => !isReferral(r) && !isWelcome(r));
    const referral = approved.filter(isReferral);
    const welcome = approved.filter(isWelcome);
    const withdrawalById = new Map(withdrawalRows.map(w => [String(w.id), w]));
    const transactions = rows.map(r => {
      const activity = String(r.activity_type || '');
      const linkedWithdrawalId = r.metadata?.withdrawal_id ? String(r.metadata.withdrawal_id) : '';
      const linkedWithdrawal = linkedWithdrawalId ? withdrawalById.get(linkedWithdrawalId) : null;
      const isWithdrawalEntry = activity.startsWith('withdrawal_') && !activity.startsWith('withdrawal_refund_');
      const category = activity.includes('withdrawal') ? 'withdrawal'
        : activity.includes('referral') ? 'referral'
        : activity.includes('loan') ? 'loan'
        : activity.includes('video') ? 'video'
        : activity.includes('quiz') ? 'quiz'
        : activity.includes('click') ? 'click'
        : activity.includes('game') ? 'game'
        : activity.includes('talking') ? 'talking_stage'
        : activity.includes('daily') ? 'daily_task'
        : activity === 'welcome_bonus' ? 'upgrade' : 'daily_task';
      return {
        id: r.id, date: new Date(r.created_at).toLocaleString('en-NG'),
        description: r.metadata?.description || activity.replaceAll('_',' '),
        amount: toNaira(Math.abs(Number(r.amount_kobo || 0))), type: Number(r.amount_kobo) < 0 ? 'debit' : 'credit',
        category, reference: r.idempotency_key,
        status: isWithdrawalEntry && linkedWithdrawal
          ? linkedWithdrawal.status === 'processing' ? 'pending' : linkedWithdrawal.status === 'completed' ? 'completed' : 'failed'
          : r.status === 'approved' ? 'completed' : ['rejected','reversed'].includes(r.status) ? 'failed' : 'pending',
      };
    });
    const loans = loanRows.map(l => ({ id: l.id, date: new Date(l.created_at).toLocaleDateString('en-NG'), amount: toNaira(l.amount_kobo), tenureMonths: l.tenure_months, monthlyRepayment: 0, totalRepayment: 0, interestRate: 0, status: l.status, bankName: l.bank_name, accountNumber: l.account_number, monthlyIncome: toNaira(l.monthly_income_kobo), employmentStatus: l.employment_status, reference: l.id }));
    const withdrawals = withdrawalRows.map(w => ({
      id: w.id, date: new Date(w.created_at).toLocaleDateString('en-NG'), amount: toNaira(w.amount_kobo),
      walletSource: w.wallet_source, bankName: w.bank_name, accountNumber: w.account_number,
      accountName: w.account_name, status: w.status === 'completed' ? 'successful' : w.status,
      reference: w.id, notes: w.admin_notes || (w.status === 'processing' ? 'Request received. Payment has not yet been sent.' : ''),
    }));
    return res.status(200).json({
      wallet: {
        availableBalance: toNaira(sum(approved)), taskBalance: toNaira(sum(task)),
        referralBalance: toNaira(sum(referral)), welcomePackBalance: toNaira(sum(welcome)),
        lifetimeEarnings: toNaira(approved.filter(r => Number(r.amount_kobo) > 0 && !String(r.activity_type || '').startsWith('withdrawal_refund_')).reduce((n,r)=>n+Number(r.amount_kobo),0)),
      }, transactions, withdrawals, loans,
    });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Wallet service is temporarily unavailable.' });
  }
}
