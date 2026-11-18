import React, { useState } from 'react';
import { Bot, Send, Sparkles, Trash2, ShieldCheck } from 'lucide-react';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const starterPrompts = [
  'How do I upgrade my MOVA account?',
  'How do I verify my bank account?',
  'Where can I find my referral link?',
  'How do I contact MOVA support?'
];

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I’m MOVA AI. I can help explain how MOVA works, guide you around the platform and answer general questions. I’m an AI assistant, not a human member or payment officer.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    const next = [...messages, { role: 'user' as const, content: question }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/mova-ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(-12).map((message) => ({
            role: message.role,
            content: message.content
          }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'MOVA AI is unavailable right now.');
      setMessages((current) => [...current, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-24">
      <div className="rounded-3xl bg-[#0B192C] text-white p-5 sm:p-7 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">MOVA AI Chat</h1>
              <span className="text-[10px] rounded-full bg-blue-500/20 text-blue-200 px-2 py-1 font-bold">AI ASSISTANT</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">Ask questions and get help using MOVA.</p>
          </div>
        </div>
        <div className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-slate-300">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-300" />
          AI-generated replies. MOVA AI cannot verify payments, approve loans, change balances or act as a real member.
        </div>
      </div>

      <div className="mt-4 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="h-[min(58vh,560px)] min-h-[360px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-[#2457F5] text-white rounded-br-md'
                  : 'bg-slate-100 text-slate-800 rounded-bl-md'
              }`}>
                {message.role === 'assistant' && <div className="text-[10px] font-extrabold text-blue-600 mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/> MOVA AI</div>}
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl px-4 py-3 text-xs text-slate-500">MOVA AI is thinking…</div>
            </div>
          )}
          {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>}
        </div>

        {messages.length === 1 && (
          <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button key={prompt} onClick={() => void sendMessage(prompt)} disabled={loading}
                className="text-xs text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-full px-3 py-2 disabled:opacity-50">
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(event) => { event.preventDefault(); void sendMessage(); }} className="border-t border-slate-100 p-3 sm:p-4 flex gap-2">
          <input value={input} onChange={(event) => setInput(event.target.value)}
            placeholder="Ask MOVA AI a question..."
            maxLength={1200}
            className="min-w-0 flex-1 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
          <button type="submit" disabled={!input.trim() || loading}
            className="rounded-2xl bg-[#2457F5] hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-3 font-bold text-sm flex items-center gap-2">
            <Send className="w-4 h-4"/> <span className="hidden sm:inline">Send</span>
          </button>
          <button type="button" title="Clear chat" onClick={() => { setMessages([{ role: 'assistant', content: 'Hi! I’m MOVA AI. How can I help you today?' }]); setError(''); }}
            className="rounded-2xl border border-slate-200 text-slate-500 px-3"><Trash2 className="w-4 h-4"/></button>
        </form>
      </div>
      <p className="text-center text-[10px] text-slate-400 mt-3">Do not share passwords, PINs, full card details or secret keys in chat.</p>
    </div>
  );
};
