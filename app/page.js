"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  CircleDollarSign,
  Users,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  QrCode,
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  Home as HomeIcon,
  ChevronRight,
  Send,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/expenseSplitter";
import PaymentModal from "@/components/Modals/PaymentModal";
import QrModal from "@/components/Modals/QrModal";

export default function Dashboard() {
  const {
    currentUser,
    expenses,
    roommateDebts,
    selectedGroup,
    totalYouOwe,
    totalYouAreOwed,
    totalGroupExpenses,
    requestPaymentReminder,
    showToast,
  } = useApp();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedRoommateId, setSelectedRoommateId] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState("");

  const netBalance = totalYouAreOwed - totalYouOwe;

  const handleOpenPayment = (userId, amount) => {
    setSelectedRoommateId(userId);
    setSelectedAmount(amount ? String(amount) : "");
    setPaymentModalOpen(true);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Mess & Food":
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
      case "Electricity":
      case "Utilities":
        return <Zap className="w-4 h-4 text-blue-600" />;
      case "Groceries":
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      default:
        return <HomeIcon className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1">
            <span>Home</span> / <span className="text-slate-600">Dashboard</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Hostel Expense Dashboard
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Room 204, Tagore Hostel • 4 Active Roommates • Split bills, dues & insights
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/add-expense"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </Link>
          <Link
            href="/settle"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>Settle Balances</span>
          </Link>
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs md:text-sm font-semibold shadow-xs hover:bg-slate-50 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">UPI QR</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Group Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Group Spend</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatINR(totalGroupExpenses)}
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-0.5 truncate max-w-[140px]">
              {selectedGroup?.name || "Room 204"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* You Owe Overall */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">You Owe Overall</span>
            <div className="text-2xl font-black text-rose-600 mt-1">
              {formatINR(totalYouOwe)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {roommateDebts.filter((d) => d.type === "you_owe" && d.amount > 0).map((d) => `To ${d.name.split(" ")[0]}`).join(", ") || "No dues"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 rotate-45" />
          </div>
        </div>

        {/* You Are Owed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">You Are Owed</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {formatINR(totalYouAreOwed)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {roommateDebts.filter((d) => d.type === "owed_to_you" && d.amount > 0).map((d) => d.name.split(" ")[0]).join(" & ") ? `From ${roommateDebts.filter((d) => d.type === "owed_to_you" && d.amount > 0).map((d) => d.name.split(" ")[0]).join(" & ")}` : "All settled"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Net Outstanding Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Net Room Balance</span>
            <div
              className={`text-2xl font-black mt-1 ${
                netBalance >= 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {netBalance >= 0 ? `+${formatINR(netBalance)}` : `-${formatINR(Math.abs(netBalance))}`}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {netBalance >= 0 ? "You're in surplus" : "Pending settlement"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Transactions & Trends (7 cols), Right Roommates & AI Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Spending Trend Bar/Spline Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Spending Overview</h3>
                <span className="text-xs text-slate-400 font-medium">October 2026 Room Budget</span>
              </div>
              <Link
                href="/ai-insights"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Full Analytics <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Chart SVG */}
            <div className="h-44 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130">
                {/* Horizontal grid lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="20" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="20" y1="100" x2="480" y2="100" stroke="#E2E8F0" strokeWidth="1" />

                {/* Bars */}
                {[
                  { x: 35, h: 40, label: "Oct 1" },
                  { x: 95, h: 65, label: "Oct 5" },
                  { x: 155, h: 30, label: "Oct 8" },
                  { x: 215, h: 85, label: "Oct 10", active: true },
                  { x: 275, h: 95, label: "Oct 15", highlight: true }, // Hostel Mess bill peak
                  { x: 335, h: 50, label: "Oct 18" },
                  { x: 395, h: 70, label: "Oct 22" },
                  { x: 455, h: 35, label: "Oct 26" },
                ].map((b, i) => (
                  <g key={i}>
                    <rect
                      x={b.x}
                      y={100 - b.h}
                      width="20"
                      height={b.h}
                      rx="4"
                      fill={b.highlight ? "#4F46E5" : b.active ? "#3B82F6" : "#CBD5E1"}
                    />
                    <text
                      x={b.x + 10}
                      y="118"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {b.label}
                    </text>
                  </g>
                ))}

                {/* Spline Curve overlay */}
                <path
                  d="M 45 65 Q 105 35, 165 70 T 225 25 T 285 10 T 345 55 T 405 35 T 465 65"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Quick Category Summary Pills */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                  Mess & Food
                </div>
                <div className="text-sm font-black text-amber-900 mt-0.5">₹2,850</div>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">
                  Utilities
                </div>
                <div className="text-sm font-black text-blue-900 mt-0.5">₹1,500</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                  Groceries
                </div>
                <div className="text-sm font-black text-emerald-900 mt-0.5">₹850</div>
              </div>
            </div>
          </div>

          {/* Recent Expense Transactions List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Hostel Transactions</h3>
                <span className="text-xs text-slate-400 font-medium">Shared room expenses</span>
              </div>
              <Link
                href="/groups/group-1"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {expenses.slice(0, 5).map((exp) => (
                <div
                  key={exp.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(exp.category)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{exp.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {exp.date} • Paid by {exp.payerName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">
                      {formatINR(exp.amount)}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        exp.statusBadge === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : exp.statusBadge === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : exp.statusBadge === "you_owe"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {exp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Roommate Dues Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Roommate Balances</h3>
                <span className="text-xs text-slate-400 font-medium">Room 204 Dues</span>
              </div>
              <Link
                href="/settle"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Settle Page
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {roommateDebts.map((debt) => (
                <div key={debt.userId} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={debt.avatar}
                      alt={debt.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{debt.name}</div>
                      <div
                        className={`text-[11px] font-semibold ${
                          debt.type === "owed_to_you"
                            ? "text-emerald-600"
                            : debt.type === "you_owe"
                            ? "text-rose-600"
                            : "text-slate-400"
                        }`}
                      >
                        {debt.statusText}
                      </div>
                    </div>
                  </div>

                  <div>
                    {debt.type === "owed_to_you" ? (
                      <button
                        onClick={() => requestPaymentReminder(debt.userId)}
                        className="px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-[11px] font-bold transition-colors"
                      >
                        Remind
                      </button>
                    ) : debt.type === "you_owe" ? (
                      <button
                        onClick={() => handleOpenPayment(debt.userId, debt.amount)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        Settle
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Settled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Spending Insights Preview Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100/50 rounded-2xl border border-indigo-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">AI Spending Alert</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                Live
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <p className="leading-relaxed">
                💡 <span className="font-bold text-indigo-950">Snacks & Canteen Pooling:</span>{" "}
                Prakalpa & Saan ordered evening snacks from the college canteen 3 times this week. Pooling
                delivery and canteen orders could save your room <span className="font-bold text-emerald-700">₹450/month</span>.
              </p>
              <p className="leading-relaxed text-slate-600">
                ⚡ <span className="font-bold text-slate-800">Room 204 Power Usage:</span> Room AC & geyser
                consumption rose 12% compared to September.
              </p>
            </div>

            <Link
              href="/ai-insights"
              className="mt-4 block w-full py-2 px-3 rounded-xl bg-white border border-indigo-200 hover:border-indigo-300 text-center text-xs font-bold text-indigo-900 shadow-xs hover:bg-indigo-50 transition-colors"
            >
              Explore AI Recommendations →
            </Link>
          </div>

          {/* Quick Hostel UPI ID Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-400/30"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] font-mono text-slate-500">UPI ID · {currentUser.upiId}</div>
              </div>
            </div>
            <button
              onClick={() => setQrModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              View QR
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultRoommateId={selectedRoommateId}
        defaultAmount={selectedAmount}
      />
      <QrModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}
