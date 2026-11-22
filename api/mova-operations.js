const json = (res, status, body) => res.status(status).json(body);

function config() {
  const url = process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) throw new Error('MOVA backend is not configured. Check the Supabase URL, publishable key and server-side service role key in Vercel.');
  return { url: url.replace(/\/$/, ''), anon, service };
}

async function supabase(path, { method = 'GET', body, service = true, prefer, headers = {} } = {}) {
  const c = config();
  const key = service ? c.service : c.anon;
  const response = await fetch(`${c.url}${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) throw new Error(data?.message || data?.msg || data?.error || `Database request failed (${response.status}).`);
  return data;
}

async function supabaseApi(path, { method = 'GET', body, service = true, headers = {} } = {}) {
  const c = config();
  const key = service ? c.service : c.anon;
  const response = await fetch(`${c.url}${path}`, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) throw new Error(data?.message || data?.msg || data?.error || `Supabase request failed (${response.status}).`);
  return data;
}

async function supabaseAll(path) {
  const all = [];
  for (let start = 0; ; start += 1000) {
    const page = await supabase(path, { headers: { Range: `${start}-${start + 999}` } });
    if (!Array.isArray(page)) throw new Error('A MOVA admin data query returned an invalid result.');
    all.push(...page);
    if (page.length < 1000) return all;
  }
}

async function identify(req) {
  const c = config();
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return { error: 'Sign in required.', status: 401 };
  const response = await fetch(`${c.url}/auth/v1/user`, { headers: { apikey: c.anon, Authorization: `Bearer ${token}` } });
  const user = await response.json().catch(() => ({}));
  if (!response.ok || !user.id) return { error: 'Your session has expired. Sign in again.', status: 401 };
  const rows = await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,full_name,username,role,membership_status,referral_code,referred_by,created_at`);
  if (!rows?.[0]) return { error: 'MOVA member profile not found.', status: 403 };
  return { authUser: user, profile: rows[0] };
}

async function requireAdmin(req) {
  const identity = await identify(req);
  if (identity.error) return identity;
  if (identity.profile.role !== 'admin' || String(identity.authUser.email || '').toLowerCase() !== 'movadigital87@gmail.com') return { error: 'Administrator access required.', status: 403 };
  return identity;
}

async function getAdminData() {
  const [profiles, payments, withdrawals, referrals, loans, audit, ledger, authUsers] = await Promise.all([
    supabaseAll('/rest/v1/profiles?select=id,full_name,username,phone,country,role,membership_status,referral_code,referred_by,created_at,premium_activated_at&order=created_at.desc'),
    supabaseAll('/rest/v1/premium_payments?select=*&order=created_at.desc'),
    supabaseAll('/rest/v1/withdrawal_requests?select=*&order=created_at.desc'),
    supabaseAll('/rest/v1/referral_commissions?select=*&order=created_at.desc'),
    supabaseAll('/rest/v1/loan_applications?select=*&order=created_at.desc'),
    supabase('/rest/v1/mova_admin_audit_log?select=*&order=created_at.desc&limit=500'),
    supabaseAll('/rest/v1/wallet_ledger?select=id,user_id,activity_type,amount_kobo,status,idempotency_key,metadata,created_at&order=created_at.desc'),
    supabaseApi('/auth/v1/admin/users?page=1&per_page=1000'),
  ]);
  const users = authUsers?.users || [];
  const emailById = new Map(users.map((u) => [u.id, u.email || '']));
  const members = profiles.map((p) => ({ ...p, email: emailById.get(p.id) || '' }));
  const paymentsWithProof = await Promise.all(payments.map(async (payment) => {
    if (!payment.proof_path) return { ...payment, proof_url: null };
    try {
      const signed = await supabaseApi(`/storage/v1/object/sign/mova-payment-proofs/${payment.proof_path}`, { method: 'POST', body: { expiresIn: 3600 } });
      const c = config();
      return { ...payment, proof_url: signed?.signedURL ? `${c.url}/storage/v1${signed.signedURL}` : null };
    } catch { return { ...payment, proof_url: null }; }
  }));
  const naira = (v) => Number(v || 0) / 100;
  const confirmed = payments.filter((p) => p.status === 'confirmed');
  const completed = withdrawals.filter((w) => w.status === 'completed');
  const pending = withdrawals.filter((w) => w.status === 'processing');
  const approvedLedger = ledger.filter((r) => r.status === 'approved');
  return {
    members,
    premiumPayments: paymentsWithProof,
    withdrawals,
    referrals,
    referralRelationships: profiles.filter((p) => p.referred_by).map((p) => ({ referred_user_id: p.id, referrer_user_id: p.referred_by, referred_email: emailById.get(p.id) || '', referrer_email: emailById.get(p.referred_by) || '', created_at: p.created_at })),
    loans,
    audit,
    ledger: ledger.slice(0, 500),
    overview: {
      registeredMembers: profiles.length,
      premiumMembers: profiles.filter((p) => p.membership_status === 'premium').length,
      standardMembers: profiles.filter((p) => p.membership_status !== 'premium').length,
      confirmedPremiumRevenue: naira(confirmed.reduce((n, p) => n + Number(p.amount_kobo || 0), 0)),
      completedWithdrawals: naira(completed.reduce((n, w) => n + Number(w.amount_kobo || 0), 0)),
      pendingWithdrawalLiability: naira(pending.reduce((n, w) => n + Number(w.amount_kobo || 0), 0)),
      pendingPremiumPayments: payments.filter((p) => p.status === 'pending').length,
      pendingWithdrawals: pending.length,
      approvedLedgerCredits: naira(approvedLedger.filter((r) => Number(r.amount_kobo) > 0).reduce((n, r) => n + Number(r.amount_kobo), 0)),
    },
  };
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const admin = await requireAdmin(req);
      if (admin.error) return json(res, admin.status, { error: admin.error });
      return json(res, 200, await getAdminData());
    }
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
    const action = req.body?.action;

    if (action === 'premium-history') {
      const member = await identify(req);
      if (member.error) return json(res, member.status, { error: member.error });
      const payments = await supabase(`/rest/v1/premium_payments?user_id=eq.${encodeURIComponent(member.profile.id)}&select=id,amount_kobo,transfer_reference,status,admin_notes,created_at&order=created_at.desc&limit=50`);
      return json(res, 200, { payments });
    }

    if (action === 'premium-submit') {
      const member = await identify(req);
      if (member.error) return json(res, member.status, { error: member.error });
      if (member.profile.membership_status === 'premium') return json(res, 409, { error: 'Your account is already Premium.' });
      const reference = String(req.body.transferReference || '').trim();
      if (reference.length < 5 || reference.length > 120) return json(res, 400, { error: 'Enter a valid bank transfer reference.' });
      if (!req.body.proofDataUrl) return json(res, 400, { error: 'Attach your bank transfer receipt before submitting.' });
      let proofPath = null;
      if (req.body.proofDataUrl) {
        const match = String(req.body.proofDataUrl).match(/^data:(image\/(?:jpeg|png)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/);
        if (!match) return json(res, 400, { error: 'Receipt must be a JPG, PNG or PDF file.' });
        const bytes = Buffer.from(match[2], 'base64');
        if (bytes.length > 3 * 1024 * 1024) return json(res, 413, { error: 'Receipt must be 3 MB or smaller.' });
        const extension = match[1] === 'application/pdf' ? 'pdf' : match[1] === 'image/png' ? 'png' : 'jpg';
        proofPath = `${member.profile.id}/${crypto.randomUUID()}.${extension}`;
        const c = config();
        const upload = await fetch(`${c.url}/storage/v1/object/mova-payment-proofs/${proofPath}`, {
          method: 'POST', headers: { apikey: c.service, Authorization: `Bearer ${c.service}`, 'Content-Type': match[1], 'x-upsert': 'false' }, body: bytes,
        });
        if (!upload.ok) {
          const detail = await upload.json().catch(() => ({}));
          throw new Error(detail.message || 'Could not save the payment receipt. Please try again.');
        }
      }
      const inserted = await supabase('/rest/v1/premium_payments', {
        method: 'POST', body: { user_id: member.profile.id, amount_kobo: 1200000, transfer_reference: reference, proof_path: proofPath, status: 'pending' }, prefer: 'return=representation',
      });
      return json(res, 201, { payment: inserted?.[0] || null, message: 'Payment submission saved for admin review. Premium remains pending until the bank credit is verified.' });
    }

    if (action === 'loan-submit') {
      const member = await identify(req);
      if (member.error) return json(res, member.status, { error: member.error });
      if (member.profile.membership_status !== 'premium') return json(res, 403, { error: 'MOVA Premium is required before applying for a loan.' });
      const amountKobo = Math.round(Number(req.body.amount) * 100);
      const tenure = Number(req.body.tenureMonths);
      const incomeKobo = Math.round(Number(req.body.monthlyIncome) * 100);
      const bank = String(req.body.bankName || '').trim();
      const accountNumber = String(req.body.accountNumber || '').trim();
      const accountName = String(req.body.accountName || '').trim();
      const employment = String(req.body.employmentStatus || '').trim();
      if (!Number.isFinite(amountKobo) || amountKobo < 2000000 || amountKobo > 50000000 || !Number.isInteger(tenure) || tenure < 1 || tenure > 12 || !Number.isFinite(incomeKobo) || incomeKobo <= 0 || !bank || !/^\d{10}$/.test(accountNumber) || !accountName || !employment) {
        return json(res, 400, { error: 'Check the loan amount, tenure, income and bank details.' });
      }
      const inserted = await supabase('/rest/v1/loan_applications', { method: 'POST', body: {
        user_id: member.profile.id, amount_kobo: amountKobo, tenure_months: tenure,
        monthly_income_kobo: incomeKobo, employment_status: employment, bank_name: bank,
        account_number: accountNumber, account_name: accountName, status: 'pending',
      }, prefer: 'return=representation' });
      return json(res, 201, { loan: inserted?.[0] || null, message: 'Your loan application has been saved for review. Approval is not guaranteed.' });
    }

    if (action === 'withdrawal-create') {
      const member = await identify(req);
      if (member.error) return json(res, member.status, { error: member.error });
      const amountKobo = Math.round(Number(req.body.amount) * 100);
      const result = await supabase('/rest/v1/rpc/mova_request_withdrawal', {
        method: 'POST', body: {
          p_user_id: member.profile.id,
          p_amount_kobo: amountKobo,
          p_wallet_source: req.body.walletSource,
          p_bank_name: String(req.body.bankName || ''),
          p_account_number: String(req.body.accountNumber || ''),
          p_account_name: String(req.body.accountName || ''),
        },
      });
      return json(res, 201, { withdrawal: result, message: 'Withdrawal request submitted and marked Processing.' });
    }

    if (action === 'admin-review-premium' || action === 'admin-review-withdrawal' || action === 'admin-review-loan') {
      const admin = await requireAdmin(req);
      if (admin.error) return json(res, admin.status, { error: admin.error });
      const isPremium = action === 'admin-review-premium';
      const isWithdrawal = action === 'admin-review-withdrawal';
      const decision = String(req.body.decision || '');
      const allowedDecisions = isPremium ? ['confirmed','rejected'] : isWithdrawal ? ['completed','rejected'] : ['under_review','approved','rejected'];
      if (!allowedDecisions.includes(decision)) return json(res, 400, { error: 'Invalid review decision.' });
      const rpc = isPremium ? 'mova_admin_review_premium' : isWithdrawal ? 'mova_admin_review_withdrawal' : 'mova_admin_review_loan';
      const idField = isPremium ? 'p_payment_id' : isWithdrawal ? 'p_withdrawal_id' : 'p_loan_id';
      const result = await supabase(`/rest/v1/rpc/${rpc}`, {
        method: 'POST', body: {
          p_admin_id: admin.profile.id,
          [idField]: req.body.id,
          p_decision: decision,
          p_notes: String(req.body.notes || ''),
        },
      });
      return json(res, 200, { record: result });
    }

    return json(res, 400, { error: 'Unknown MOVA operation.' });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : 'MOVA service error.' });
  }
}
