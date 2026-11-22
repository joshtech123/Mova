import React, { useState } from 'react';
import { Bot, MessageCircle, Send, X, ExternalLink } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; text: string };

export const SupportAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! I’m MOVA’s AI help assistant. I can explain how the platform works. I cannot see your private account, confirm payments or approve withdrawals. Submit Premium payments and receipts inside MOVA. You can join the official channel for announcements.' }
  ]);

  const send = async () => {
    const q = question.trim();
    if (!q || busy) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setQuestion('');
    setBusy(true);
    try {
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The help assistant is not configured yet.');
      setMessages((m) => [...m, { role: 'assistant', text: data.answer }]);
    } catch (error) {
      setMessages((m) => [...m, { role: 'assistant', text: error instanceof Error ? error.message : 'Please try again later.' }]);
    } finally {
      setBusy(false);
    }
  };

  const openTelegram = () => {
    window.open('https://t.me/Movaofficials1', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-5 right-5 z-[70] rounded-full bg-[#0B192C] text-white shadow-xl px-4 py-3 flex items-center gap-2 text-sm font-bold hover:bg-[#142b4a]">
        {open ? <X className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
        {open ? 'Close help' : 'Ask MOVA AI'}
      </button>
      {open && <section className="fixed bottom-20 right-4 sm:right-5 z-[70] w-[min(92vw,380px)] h-[min(70vh,560px)] bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <header className="bg-[#0B192C] text-white p-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><Bot className="w-5 h-5 text-blue-300" /></span>
          <div><h3 className="font-extrabold text-sm">MOVA AI Assistant</h3><p className="text-[10px] text-slate-300">Platform help and guidance</p></div>
        </header>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
          {messages.map((m, i) => <div key={i} className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-xs leading-5 whitespace-pre-wrap ${m.role === 'user' ? 'ml-auto bg-[#2457F5] text-white' : 'mr-auto bg-white border border-slate-200 text-slate-700'}`}>{m.text}</div>)}
          {busy && <p className="text-[11px] text-slate-400">MOVA AI is typing…</p>}
        </div>
        <div className="p-3 border-t border-slate-200 bg-white space-y-2">
          <div className="flex gap-2"><input value={question} onChange={(e)=>setQuestion(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter') void send();}} placeholder="Ask about MOVA..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-500" /><button onClick={()=>void send()} disabled={busy || !question.trim()} className="rounded-xl bg-[#2457F5] text-white px-3 disabled:opacity-40"><Send className="w-4 h-4"/></button></div>
          <button onClick={openTelegram} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#2457F5] py-2"><ExternalLink className="w-3.5 h-3.5"/> Join official MOVA channel</button>
        </div>
      </section>}
    </>
  );
};
