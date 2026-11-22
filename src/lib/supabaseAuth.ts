const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;
const SESSION_KEY = 'mova_supabase_session_v1';

export type MovaAuthProfile = {
  id: string; full_name: string; username: string; phone: string | null; country: string;
  role: 'user' | 'admin'; membership_status: 'standard' | 'premium'; referral_code: string;
  welcome_bonus_kobo: number; created_at: string; referred_by?: string | null; premium_activated_at?: string | null;
};

function config() {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase is not configured. Check Vercel environment variables VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  return { url: SUPABASE_URL.replace(/\/$/, ''), key: SUPABASE_KEY };
}
function headers(token?: string) {
  const { key } = config();
  return { apikey: key, Authorization: `Bearer ${token || key}`, 'Content-Type': 'application/json' };
}
export function getSavedSession(): any | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
export function saveSession(session: any | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}
async function request(path: string, init: RequestInit = {}, token?: string) {
  const { url } = config();
  const response = await fetch(`${url}${path}`, { ...init, headers: { ...headers(token), ...(init.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.msg || body.message || body.error_description || body.error || 'Supabase request failed.');
  return body;
}
export async function signUp(email: string, password: string, metadata: Record<string, unknown>) {
  const result = await request('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password, data: metadata }) });
  if (result.access_token) saveSession(result);
  return result;
}
export async function signIn(email: string, password: string) {
  const result = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveSession(result);
  return result;
}
export async function signOut() {
  const session = getSavedSession();
  if (session?.access_token) await request('/auth/v1/logout', { method: 'POST' }, session.access_token).catch(() => undefined);
  saveSession(null);
}
export async function loadProfile(userId: string, token: string): Promise<MovaAuthProfile> {
  const rows = await request(`/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}&select=*`, { method: 'GET' }, token);
  if (!rows?.[0]) throw new Error('Your account was created, but its MOVA profile is not available yet. Contact support before trying again.');
  return rows[0] as MovaAuthProfile;
}
