import React, { useState } from 'react';
import {
  Search,
  Globe2,
  Send,
  MoreVertical,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  AlertCircle,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatParticipant } from '../types';

export const GlobalChatPage: React.FC = () => {
  const {
    currentUser,
    chatParticipants,
    chatMessages,
    sendDirectMessage,
    blockUser,
    reportUser,
    claimDailyChatReward,
    platformSettings,
    setActiveNavTab,
    setShowActivationModal,
  } = useApp();

  const [selectedUser, setSelectedUser] = useState<ChatParticipant>(chatParticipants[0]);
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const countries = ['all', 'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'United Kingdom'];

  const filteredParticipants = chatParticipants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || p.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const activeMessages = chatMessages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.receiverId === selectedUser?.id) ||
      (m.senderId === selectedUser?.id && m.receiverId === currentUser?.id)
  );

  const messagesSentToday = currentUser?.stats?.chatMessagesToday || 0;
  const isRewardEligible = messagesSentToday >= 5;
  const dailyReward = platformSettings.chatDailyRewardAmount; // ₦2,000

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser?.isPremium) {
      setShowActivationModal(true);
      return;
    }

    sendDirectMessage(selectedUser.id, inputText);
    setInputText('');
  };

  return (
    <div className="space-y-5 pb-24 sm:pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Global Communication
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connect with verified members worldwide. Send 5 meaningful messages to claim today&apos;s ₦2,000 reward.
          </p>
        </div>

        {/* Daily Chat Reward Claim Pill */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Daily Chat Progress
            </span>
            <span className="text-xs font-black text-slate-900">
              {messagesSentToday}/5 Messages Sent
            </span>
          </div>

          <button
            onClick={() => claimDailyChatReward()}
            disabled={!isRewardEligible}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              isRewardEligible
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Claim ₦{dailyReward.toLocaleString()}
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left: User Discovery & Contacts (4 cols) */}
        <div className="md:col-span-5 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          {/* Search & Country Filter */}
          <div className="p-3.5 border-b border-slate-200/80 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
              />
            </div>

            {/* Country filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                    selectedCountry === c
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c === 'all' ? 'All Countries' : c}
                </button>
              ))}
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredParticipants.map((p) => {
              const isSelected = selectedUser?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedUser(p)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    {p.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900 truncate">{p.name}</span>
                      <span className="text-[10px] font-medium text-slate-400">{p.lastSeen}</span>
                    </div>
                    <p className="text-[11px] text-blue-600 font-medium">@{p.username} • {p.country}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.bio}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Messaging Thread (7 cols) */}
        <div className="md:col-span-7 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                  {selectedUser.name}
                </h4>
                <p className="text-[11px] text-emerald-600 font-medium">
                  {selectedUser.isOnline ? 'Active Online' : selectedUser.lastSeen} • {selectedUser.country}
                </p>
              </div>
            </div>

            <div className="relative flex items-center gap-1">
              {selectedUser.talkingStageEligible && (
                <button
                  onClick={() => setActiveNavTab('talking-stage')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200 hover:bg-rose-100"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                  <span>Talking Stage</span>
                </button>
              )}

              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Safety dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-20 text-xs">
                  <button
                    onClick={() => {
                      reportUser(selectedUser.id, 'Inappropriate messages');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Report User</span>
                  </button>
                  <button
                    onClick={() => {
                      blockUser(selectedUser.id);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-left font-medium"
                  >
                    <Ban className="w-3.5 h-3.5 text-rose-500" />
                    <span>Block User</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {activeMessages.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No messages exchanged with {selectedUser.name} yet. Say hello and start your conversation!
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMine = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMine
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder={
                currentUser?.isPremium
                  ? `Message ${selectedUser.name}...`
                  : 'Activate Premium (₦12K) to chat and earn rewards...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-100 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
