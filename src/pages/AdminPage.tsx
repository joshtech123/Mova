import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, RefreshCw, ShieldCheck, Users, Wallet, CreditCard, ArrowDownToLine, FileText } from 'lucide-react';
import { getSavedSession } from '../lib/supabaseAuth';
import { useApp } from '../context/AppContext';

type AdminData = {
  members: any[]; premiumPayments: any[]; withdrawals: any[]; referrals: any[]; referralRelationships: any[]; loans: any[]; audit: any[]; ledger: any[];
  overview: Record<string, number>;
};

const money = (koboOrNaira: number, isKobo = false) => `₦${(Number(koboOrNaira || 0) / (isKobo ? 100 : 1)).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;

export const AdminPage: React.FC = () => {
  const { user, addToast } = useApp();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [tab, setTab] = useState<'overview'|'members'|'payments'|'withdrawals'|'referrals'|'loans'|'ledger'|'audit'>('overview');

  const load = useCallback(async () => {
    const session = getSavedSession();
    if (!session?.access_token) { setLoading(false); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/mova-operations', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not load admin records.');
      setData(result);
    } catch (error) {
      addToast({ type: 'error', title: 'Admin data unavailable', message: error instanceof Error ? error.message : 'Please try again.' });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const review = async (action: 'admin-review-premium'|'admin-review-withdrawal'|'admin-review-loan', id: string, decision: string) => {
    const session = getSavedSession();
    if (!session?.access_token) return;
    const notes = window.prompt(decision === 'rejected' ? 'Enter the reason for rejection:' : 'Optional admin note:') || '';
    if (decision === 'rejected' && !notes.trim()) {
      addToast({ type: 'error', title: 'Reason required', message: 'Enter a reason before rejecting this request.' });
      return;
    }
    setBusyId(id);
    try {
      const response = await fetch('/api/mova-operations', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action, id, decision, notes }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not update this record.');
      addToast({ type: 'success', title: 'Record updated', message: 'The decision was saved to the MOVA database and audit log.' });
      await load();
    } catch (error) {
      addToast({ type: 'error', title: 'Action failed', message: error instanceof Error ? error.message : 'Please try again.' });
    } finally { setBusyId(''); }
  };

  const tabs = [
    ['overview','Overview'],['members','Members'],['payments','Premium payments'],['withdrawals','Withdrawals'],['referrals','Referrals'],['loans','Loans'],['ledger','Wallet ledger'],['audit','Audit log'],
  ] as const;

  if (loading && !data) return <div className="max-w-6xl mx-auto p-6"><div className="rounded-3xl bg-white border p-8 text-sm text-slate-500">Loading live MOVA records from Supabase...</div></div>;
  if (!data) return <div className="max-w-6xl mx-auto p-6"><div className="rounded-3xl bg-white border p-8"><h2 className="font-bold">Admin data could not be loaded</h2><p className="text-sm text-slate-500 mt-2">Check that the reviewed MOVA database migration has been applied and the server-side Supabase key is configured.</p><button onClick={load} className="mt-4 rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-bold">Try again</button></div></div>;

  const o = data.overview;
  return <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24 space-y-5">
    <header className="rounded-3xl bg-[#080D35] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3"><div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-blue-300"/></div><div><div className="text-xs uppercase tracking-wider text-blue-200 font-bold">MOVA secure operations</div><h1 className="text-2xl font-black">Admin dashboard</h1><p className="text-xs text-slate-300 mt-1">Live records from the MOVA Supabase database</p></div></div>
      <div className="text-xs text-slate-300">Signed in: <strong className="text-white">{user?.email}</strong><button onClick={load} className="ml-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white"><RefreshCw className="h-3.5 w-3.5"/>Refresh</button></div>
    </header>
    <nav className="flex gap-2 overflow-x-auto pb-1">{tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold ${tab===id?'bg-blue-600 text-white':'bg-white border text-slate-600'}`}>{label}</button>)}</nav>

    {tab==='overview' && <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[[Users,'Registered members',o.registeredMembers],[ShieldCheck,'Premium members',o.premiumMembers],[CreditCard,'Confirmed Premium revenue',money(o.confirmedPremiumRevenue)],[ArrowDownToLine,'Pending withdrawal liability',money(o.pendingWithdrawalLiability)]].map(([Icon,label,value]:any)=><div key={label} className="rounded-2xl border bg-white p-4"><div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="h-4 w-4"/>{label}</div><div className="text-xl font-black text-slate-900 mt-2">{value}</div></div>)}
      </div>
      <div className="grid sm:grid-cols-3 gap-3">{[['Standard members',o.standardMembers],['Pending Premium payments',o.pendingPremiumPayments],['Processing withdrawals',o.pendingWithdrawals]].map(([label,value]:any)=><div key={label} className="rounded-2xl bg-white border p-4"><div className="text-xs text-slate-500">{label}</div><div className="text-2xl font-black mt-1">{value}</div></div>)}</div>
      <div className="rounded-2xl bg-white border p-5"><h2 className="font-bold">Financial figures</h2><p className="text-xs text-slate-500 mt-1">Values are calculated from confirmed payment records and saved withdrawal requests. Pending amounts are not counted as paid.</p><div className="grid sm:grid-cols-2 gap-4 mt-4"><div><div className="text-xs text-slate-500">Completed withdrawals</div><div className="text-xl font-black">{money(o.completedWithdrawals)}</div></div><div><div className="text-xs text-slate-500">Approved wallet credits, gross</div><div className="text-xl font-black">{money(o.approvedLedgerCredits)}</div></div></div></div>
    </>}

    {tab==='members' && <div className="rounded-2xl bg-white border overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr>{['Member','Email','Username','Membership','Joined'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{data.members.map(m=><tr className="border-t" key={m.id}><td className="p-3 font-bold">{m.full_name}</td><td className="p-3">{m.email||'Email unavailable'}</td><td className="p-3">@{m.username}</td><td className="p-3">{m.membership_status}</td><td className="p-3">{new Date(m.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}

    {tab==='payments' && <div className="space-y-3">{data.premiumPayments.length===0?<Empty text="No Premium payment submissions have been recorded."/>:data.premiumPayments.map(p=><div key={p.id} className="rounded-2xl border bg-white p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"><div><div className="font-bold text-sm">{money(p.amount_kobo,true)} · {p.transfer_reference}</div><div className="text-xs text-slate-500 mt-1">Member: {data.members.find(m=>m.id===p.user_id)?.email||p.user_id} · {new Date(p.created_at).toLocaleString()}</div><div className="text-xs mt-1">Status: <strong>{p.status}</strong></div>{p.proof_url&&<a className="inline-block mt-2 text-blue-600 underline" href={p.proof_url} target="_blank" rel="noreferrer">View submitted receipt</a>}</div>{p.status==='pending'&&<div className="flex gap-2"><button disabled={busyId===p.id} onClick={()=>review('admin-review-premium',p.id,'confirmed')} className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold">Confirm bank credit</button><button disabled={busyId===p.id} onClick={()=>review('admin-review-premium',p.id,'rejected')} className="rounded-xl bg-rose-50 text-rose-700 px-3 py-2 text-xs font-bold">Reject</button></div>}</div>)}</div>}

    {tab==='withdrawals' && <div className="space-y-3">{data.withdrawals.length===0?<Empty text="No withdrawal requests have been recorded."/>:data.withdrawals.map(w=><div key={w.id} className="rounded-2xl border bg-white p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"><div><div className="font-bold">{money(w.amount_kobo,true)} · {w.status.toUpperCase()}</div><div className="text-xs text-slate-500 mt-1">{data.members.find(m=>m.id===w.user_id)?.email||w.user_id} · {w.wallet_source} wallet</div><div className="text-xs mt-1">{w.bank_name} · {w.account_number} · {w.account_name}</div><div className="text-[11px] text-slate-400 mt-1">{new Date(w.created_at).toLocaleString()}</div></div>{w.status==='processing'&&<div className="flex gap-2"><button disabled={busyId===w.id} onClick={()=>review('admin-review-withdrawal',w.id,'completed')} className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold">Mark paid</button><button disabled={busyId===w.id} onClick={()=>review('admin-review-withdrawal',w.id,'rejected')} className="rounded-xl bg-rose-50 text-rose-700 px-3 py-2 text-xs font-bold">Reject & refund</button></div>}</div>)}</div>}

    {tab==='referrals' && <div className="space-y-4"><div className="rounded-2xl bg-white border overflow-x-auto"><div className="p-4 border-b"><h3 className="font-bold">Referral relationships</h3><p className="text-xs text-slate-500 mt-1">Who joined using another member's referral code. These are registrations, not automatically paid commissions.</p></div><table className="w-full text-left text-xs"><thead className="bg-slate-50"><tr>{['Referrer','New member','Joined'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{data.referralRelationships.map((r:any)=><tr key={r.referred_user_id} className="border-t"><td className="p-3">{r.referrer_email||r.referrer_user_id}</td><td className="p-3">{r.referred_email||r.referred_user_id}</td><td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>{data.referralRelationships.length===0&&<Empty text="No referral-attributed registrations have been recorded yet."/>}</div><div className="rounded-2xl bg-white border overflow-x-auto"><div className="p-4 border-b"><h3 className="font-bold">Verified referral commissions</h3></div><table className="w-full text-left text-xs"><thead className="bg-slate-50"><tr>{['Referrer','Referred member','Tier','Commission','Status','Date'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{data.referrals.map(r=><tr key={r.id} className="border-t"><td className="p-3">{data.members.find(m=>m.id===r.referrer_user_id)?.email||r.referrer_user_id}</td><td className="p-3">{data.members.find(m=>m.id===r.referred_user_id)?.email||r.referred_user_id}</td><td className="p-3">{r.tier}</td><td className="p-3">{money(r.amount_kobo,true)}</td><td className="p-3">{r.status}</td><td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>{data.referrals.length===0&&<Empty text="No referral commissions have been credited or recorded."/>}</div></div>}

    {tab==='loans' && <div className="space-y-3">{data.loans.length===0?<Empty text="No loan applications have been recorded."/>:data.loans.map(l=><div key={l.id} className="rounded-2xl border bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><div className="font-bold">{money(l.amount_kobo,true)} · {l.status}</div><div className="text-xs text-slate-500 mt-1">{data.members.find(m=>m.id===l.user_id)?.email||l.user_id} · {l.bank_name} · {l.account_number} · {l.account_name}</div><div className="text-xs text-slate-500">Tenure: {l.tenure_months} months · Monthly income: {money(l.monthly_income_kobo,true)} · {new Date(l.created_at).toLocaleString()}</div></div>{['pending','under_review','reviewing'].includes(l.status)&&<div className="flex gap-2"><button disabled={busyId===l.id} onClick={()=>review('admin-review-loan',l.id,'under_review')} className="rounded-xl border px-3 py-2 text-xs font-bold">Review</button><button disabled={busyId===l.id} onClick={()=>review('admin-review-loan',l.id,'approved')} className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold">Approve</button><button disabled={busyId===l.id} onClick={()=>review('admin-review-loan',l.id,'rejected')} className="rounded-xl bg-rose-50 text-rose-700 px-3 py-2 text-xs font-bold">Reject</button></div>}</div>)}</div>}

    {tab==='ledger' && <div className="rounded-2xl bg-white border overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50"><tr>{['Member','Activity','Amount','Status','Reference','Date'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{data.ledger.map(r=><tr className="border-t" key={r.id}><td className="p-3">{data.members.find(m=>m.id===r.user_id)?.email||r.user_id}</td><td className="p-3">{r.activity_type}</td><td className="p-3">{money(r.amount_kobo,true)}</td><td className="p-3">{r.status}</td><td className="p-3">{r.idempotency_key}</td><td className="p-3">{new Date(r.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>}

    {tab==='audit' && <div className="space-y-2">{data.audit.length===0?<Empty text="No administrator actions have been recorded yet."/>:data.audit.map(a=><div key={a.id} className="rounded-xl border bg-white p-4"><div className="font-bold text-sm">{a.action}</div><div className="text-xs text-slate-500 mt-1">{a.entity_type} · {a.entity_id} · {new Date(a.created_at).toLocaleString()}</div><pre className="text-[11px] text-slate-500 mt-2 whitespace-pre-wrap">{JSON.stringify(a.details,null,2)}</pre></div>)}</div>}
    <div className="text-[11px] text-slate-400 flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5"/>This dashboard displays database records only. No sample members, payments or earnings are generated.</div>
  </div>;
};

const Empty: React.FC<{text:string}> = ({text}) => <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-slate-500">{text}</div>;
