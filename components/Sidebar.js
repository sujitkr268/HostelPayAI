"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  CircleDollarSign,
  User,
  Sparkles,
  HelpCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { currentUser, showToast } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Groups", href: "/groups", icon: Users },
    { name: "Add Expense", href: "/add-expense", icon: PlusCircle },
    { name: "Settle Payments", href: "/settle", icon: CircleDollarSign },
    { name: "AI Insights", href: "/ai-insights", icon: Sparkles },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const handleLogout = () => {
    showToast("Signed out from Sujit's session (Demo mode)", "info");
    window.location.href = "/login";
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#0b132b] text-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-white">HostelPay</span>
            <span className="text-xl font-extrabold text-cyan-400">AI</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              AI
            </span>
          </div>
        </Link>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-indigo-950/80 via-indigo-900/50 to-cyan-950/40 text-cyan-300 shadow-sm border border-indigo-700/50"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400/50" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile section */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between px-2 text-xs font-medium text-slate-400">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Sujit K. User Badge */}
        <div className="relative">
          <div
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div className="text-left">
                <div className="text-sm font-semibold text-white leading-tight">
                  {currentUser.shortName}
                </div>
                <div className="text-xs text-slate-400">(Room {currentUser.roomNumber})</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          {userDropdownOpen && (
            <div className="absolute bottom-16 left-0 right-0 p-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl space-y-1 text-xs">
              <Link
                href="/profile"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 font-medium"
              >
                View Profile & Settings
              </Link>
              <Link
                href="/login"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 font-medium"
              >
                Switch Account
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-300 font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-full z-10 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
