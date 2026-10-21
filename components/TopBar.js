"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, ChevronDown, Menu, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function TopBar({ setMobileOpen }) {
  const {
    currentUser,
    aiSparkleEnabled,
    setAiSparkleEnabled,
    searchQuery,
    setSearchQuery,
    showToast,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notifications = [
    {
      id: "notif-1",
      title: "Mess Bill Due",
      message: "Garvit Sharma added ₹2,400 for Hostel Mess - Monthly Bill",
      time: "10m ago",
      unread: true,
    },
    {
      id: "notif-2",
      title: "Payment Received",
      message: "Prakalpa Sen settled ₹400 via UPI",
      time: "2h ago",
      unread: false,
    },
    {
      id: "notif-3",
      title: "AI Split Alert",
      message: "You can save ₹450 by pooling canteen orders with Saan",
      time: "1d ago",
      unread: false,
    },
  ];

  const handleToggleAi = () => {
    const nextState = !aiSparkleEnabled;
    setAiSparkleEnabled(nextState);
    showToast(
      nextState
        ? "AI Sparkle enabled! Smart recommendations active."
        : "AI Sparkle paused.",
      "info"
    );
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Greeting & Mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Hey Sujit!
            </h1>
            <span className="text-xl md:text-2xl select-none">👋</span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Welcome back to Room 204, Tagore Hostel.
          </p>
        </div>
      </div>

      {/* Right: Search, AI Sparkle toggle, Notifications, User Avatar */}
      <div className="flex items-center gap-3 md:gap-5 self-end md:self-auto w-full md:w-auto justify-end">
        {/* Search Bar */}
        <div className="relative flex-1 md:w-64 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-100/90 border border-transparent focus:border-indigo-400 focus:bg-white rounded-full transition-all outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* AI Sparkle Switch */}
        <div className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-100 px-3 py-1.5 rounded-full select-none shadow-xs">
          <Sparkles
            className={`w-4 h-4 transition-colors ${
              aiSparkleEnabled ? "text-indigo-600 animate-pulse" : "text-slate-400"
            }`}
          />
          <span className="text-xs font-semibold text-indigo-900 hidden sm:inline">
            AI Sparkle
          </span>
          <button
            onClick={handleToggleAi}
            className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
              aiSparkleEnabled ? "bg-indigo-600" : "bg-slate-300"
            }`}
            title="Toggle AI Recommendations"
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${
                aiSparkleEnabled ? "left-5" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                <span className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-1.5 focus:outline-none group"
            aria-label="User profile menu"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-100">
                <div className="font-semibold text-slate-800">{currentUser.name}</div>
                <div className="text-slate-500 text-[11px] truncate">{currentUser.email}</div>
              </div>
              <Link
                href="/profile"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium"
              >
                Profile & Settings
              </Link>
              <Link
                href="/settle"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium"
              >
                Roommate Balances
              </Link>
              <Link
                href="/login"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium"
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
