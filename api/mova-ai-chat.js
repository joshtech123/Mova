export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'MOVA AI is not configured yet. Add OPENAI_API_KEY in Vercel Environment Variables.' });

  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = incoming
    .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
    .slice(-12)
    .map((item) => ({ role: item.role, content: item.content.slice(0, 1200) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Send a message to MOVA AI first.' });
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini',
        instructions: `You are MOVA AI, the clearly disclosed AI help assistant inside the MOVA platform. Speak in clear, friendly, simple English. Help with platform navigation and explain only these known facts: MOVA Premium costs ₦12,000; the official transfer account is MOVA DIGITAL HUB, account number 3004611364, KUDA MICROFINANCE BANK. Never claim a payment has been received or verified. Never activate Premium, change a balance, approve a withdrawal, approve a loan, or claim you can access a member's private account. Never promise earnings or loan approval. If asked about an account-specific issue, payment proof, withdrawal or loan decision, direct the member to official human MOVA support. Do not pretend to be a human member. Never request passwords, PINs, OTPs, API keys or full card details.`,
        input: messages,
        max_output_tokens: 500
      })
    });
    const payload = await upstream.json();
    if (!upstream.ok) {
      return res.status(502).json({ error: payload.error?.message || 'The AI provider could not respond. Please try again.' });
    }
    const answer = (payload.output || [])
      .flatMap((item) => item.content || [])
      .filter((part) => part.type === 'output_text')
      .map((part) => part.text)
      .join('\n')
      .trim();
    if (!answer) return res.status(502).json({ error: 'MOVA AI returned an empty response. Please try again.' });
    return res.status(200).json({ answer });
  } catch {
    return res.status(502).json({ error: 'MOVA AI is temporarily unavailable. Please try again.' });
  }
}
