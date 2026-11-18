export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'MOVA AI support is not configured yet. The platform owner must add OPENAI_API_KEY in Vercel.' });
  const question = String(req.body?.question || '').trim().slice(0, 1200);
  if (!question) return res.status(400).json({ error: 'Type a question first.' });
  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini',
        instructions: 'You are MOVA platform support. Use clear, friendly English. Explain general platform navigation, membership and published feature rules only. Never claim to access a member account, verify a transfer, approve a withdrawal, approve a loan, or change balances. Never promise earnings or loan approval. For payment proof or account-specific issues, direct the user to MOVA human support on Telegram. If a policy is not provided, say you do not have confirmed information and advise contacting MOVA support.',
        input: question,
        max_output_tokens: 350
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(502).json({ error: data.error?.message || 'MOVA AI could not respond. Please try again.' });
    const answer = (data.output || []).flatMap(item => item.content || []).filter(part => part.type === 'output_text').map(part => part.text).join('\\n').trim();
    if (!answer) return res.status(502).json({ error: 'MOVA AI returned an empty response. Please try again.' });
    return res.status(200).json({ answer });
  } catch {
    return res.status(502).json({ error: 'MOVA AI is temporarily unavailable. Please try again.' });
  }
}
