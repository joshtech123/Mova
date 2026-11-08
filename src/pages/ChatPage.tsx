import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatUser } from '../types';
import {
  MessageCircle,
  Search,
  Filter,
  Send,
  ShieldAlert,
  Ban,
  MoreVertical,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChatPage: React.FC = () => {
  const { user, chatUsers, chatMessages, sendChatMessage, addToast, wallet, transactions } = useApp();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(chatUsers[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [inputText, setInputText] = useState('');
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [dailyChatClaimed, setDailyChatClaimed] = useState(false);

  const countries = ['All', 'Nigeria', 'Ghana', 'Kenya', 'United Kingdom', 'South Africa', 'United States'];

  const filteredUsers = chatUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === 'All' || u.country === countryFilter;
    return matchesSearch && matchesCountry && !u.isBlocked;
  });

  const activeMessages = selectedUser ? chatMessages[selectedUser.id] || [] : [];
  const userSentCount = activeMessages.filter((m) => m.senderId === user?.id).length;
  const canClaimDailyChat = userSentCount >= 3 && !dailyChatClaimed;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUser) return;
    sendChatMessage(selectedUser.id, inputText);
    setInputText('');
  };

  const handleClaimChatReward = () => {
    if (!canClaimDailyChat) return;
    setDailyChatClaimed(true);
    addToast({
      type: 'reward',
      title: '₦2,000 Chat Reward Credited!',
      message: 'Qualifying global community chat verified for today.',
    });
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const handleBlockUser = () => {
    if (!selectedUser) return;
    addToast({
      type: 'info',
      title: 'User Blocked',
      message: `@${selectedUser.username} has been blocked from contacting you.`,
    });
    setShowUserOptions(false);
  };

  const handleReportUser = () => {
    if (!selectedUser) return;
    addToast({
      type: 'info',
      title: 'Report Submitted',
      message: `Report filed for @${selectedUser.username}. Our moderation team will review.`,
    });
    setShowUserOptions(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
              GLOBAL COMMUNICATION
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
              Live Network
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Connect Globally with MOVA</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Chat with members worldwide. Authentic, meaningful daily conversations qualify for ₦2,000 daily reward.
          </p>
        </div>

        {/* Claim chat reward button */}
        <div className="shrink-0 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400">Daily Chat Progress: {userSentCount}/3 msgs</p>
          <button
            onClick={handleClaimChatReward}
            disabled={!canClaimDailyChat}
            className={`mt-2 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              canClaimDailyChat
                ? 'bg-[#0056FD] hover:bg-[#0047D4] text-white shadow-md shadow-blue-600/30 animate-pulse'
                : dailyChatClaimed
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {dailyChatClaimed ? '✓ ₦2,000 Claimed' : 'Claim ₦2,000 Reward'}
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* User Sidebar List (Left 4 cols) */}
        <div
          className={`md:col-span-5 border-r border-slate-100 flex flex-col ${
            selectedUser ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or @username..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>

            {/* Country filter chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                    countryFilter === c
                      ? 'bg-[#0056FD] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredUsers.map((u) => {
              const isSelected = selectedUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                    isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={u.avatar} alt={u.name} className="w-11 h-11 rounded-full object-cover" />
                    {u.isOnline && (
                      <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                        <span>{u.name}</span>
                        <span>{u.countryFlag}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400">{u.isOnline ? 'Online' : u.lastSeen}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">@{u.username} • {u.country}</p>
                    <p className="text-[10px] text-slate-400 truncate italic mt-0.5">{u.bio}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Thread View (Right 7 cols) */}
        <div
          className={`md:col-span-7 flex flex-col bg-slate-50/50 ${
            selectedUser ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selectedUser ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 px-4 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="relative shrink-0">
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedUser.isOnline && (
                      <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{selectedUser.name}</span>
                      <span>{selectedUser.countryFlag}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      @{selectedUser.username} • {selectedUser.isOnline ? 'Active now' : selectedUser.lastSeen}
                    </p>
                  </div>
                </div>

                {/* More Options dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserOptions(!showUserOptions)}
                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showUserOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-20 text-xs animate-in fade-in">
                      <button
                        onClick={handleBlockUser}
                        className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Block User</span>
                      </button>
                      <button
                        onClick={handleReportUser}
                        className="w-full text-left px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Report Misconduct</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="text-center my-2">
                  <span className="text-[10px] bg-slate-200/60 text-slate-600 px-3 py-1 rounded-full">
                    Conversation protected by MOVA Community Guidelines
                  </span>
                </div>

                {activeMessages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in`}
                    >
                      <div
                        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-[#0056FD] text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message @${selectedUser.username}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform active:scale-95 ${
                    inputText.trim()
                      ? 'bg-[#0056FD] text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageCircle className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Select a community member to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
