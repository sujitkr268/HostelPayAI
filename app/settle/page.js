"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  TrendingUp,
  Plus,
  QrCode,
  Sparkles,
  CheckCircle,
  Clock,
  Send,
  CreditCard,
  Banknote,
  Smartphone,
  Info,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/expenseSplitter";
import PaymentModal from "@/components/Modals/PaymentModal";
import QrModal from "@/components/Modals/QrModal";

export default function SettlePage() {
  const {
    roommates,
    roommateDebts,
    settlements,
    totalYouOwe,
    totalYouAreOwed,
    totalCompletedSettlements,
    requestPaymentReminder,
    recordSettlement,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'history'
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedRoommateId, setSelectedRoommateId] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");

  // Handle open payment modal
  const handleOpenPayment = (userId, amount, mode = "upi") => {
    setSelectedRoommateId(userId);
    setSelectedAmount(amount ? String(amount) : "");
    setPaymentMode(mode);
    setPaymentModalOpen(true);
  };

  // Filtered roommate debts
  const displayedDebts = roommateDebts.filter((d) => {
    if (activeTab === "pending") return d.amount > 0;
    if (activeTab === "history") return d.amount === 0;
    return true; // 'all'
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>{" "}
            / <span className="text-slate-600">Settle Payments</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Settle Payments
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Clear your balances, request dues, and track payment history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenPayment(null, "500", "cash")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs md:text-sm font-semibold shadow-xs hover:bg-slate-50 transition-all"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>Record Cash Payment</span>
          </button>
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan UPI QR</span>
          </button>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* You Owe Overall */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">You Owe Overall</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatINR(totalYouOwe)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">
              {roommateDebts.filter((d) => d.type === "you_owe" && d.amount > 0).map((d) => `To ${d.name.split(" ")[0]}`).join(", ") || "No dues"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-rose-500 rotate-45" />
          </div>
        </div>

        {/* You Are Owed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">You Are Owed</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
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

        {/* Total Completed Settlements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">
              Total Completed Settlements
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatINR(totalCompletedSettlements)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">This term</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: 60% Left / 40% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols ~ 60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-5 pb-0 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Roommate Balances</h3>
              <span className="text-xs font-semibold text-slate-400">60%</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-3 relative transition-colors ${
                  activeTab === "all" ? "text-indigo-600" : "hover:text-slate-800"
                }`}
              >
                Who Owes Whom
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-3 relative transition-colors ${
                  activeTab === "pending" ? "text-indigo-600" : "hover:text-slate-800"
                }`}
              >
                Pending Dues
                {activeTab === "pending" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-3 relative transition-colors ${
                  activeTab === "history" ? "text-indigo-600" : "hover:text-slate-800"
                }`}
              >
                Payment History
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Group Subheader */}
          <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Room 204 (Tagore Hostel)
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {displayedDebts.length} active balances
            </span>
          </div>

          {/* Roommate Rows */}
          <div className="divide-y divide-slate-100">
            {displayedDebts.map((debt) => {
              const isOwedToSujit = debt.type === "owed_to_you";
              const isSettled = debt.amount === 0;

              return (
                <div
                  key={debt.userId}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={debt.avatar}
                      alt={debt.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{debt.name}</div>
                      {isSettled ? (
                        <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" /> All settled up!
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <div
                            className={`text-xs font-semibold ${
                              isOwedToSujit ? "text-emerald-700" : "text-rose-600"
                            }`}
                          >
                            {isOwedToSujit
                              ? `Owes you ${formatINR(debt.amount)}`
                              : `You owe ${formatINR(debt.amount)}`}
                          </div>
                          {debt.reason && (
                            <div className="text-[11px] text-slate-400">{debt.reason}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">
                        {formatINR(debt.amount)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium ml-1">
                        {isSettled
                          ? "(Settled)"
                          : isOwedToSujit
                          ? "(You are owed)"
                          : "(You owe)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSettled ? (
                        <button
                          onClick={() => handleOpenPayment(debt.userId, "200", "upi")}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          New Split
                        </button>
                      ) : isOwedToSujit ? (
                        <>
                          <button
                            onClick={() => requestPaymentReminder(debt.userId)}
                            className="px-3 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-colors"
                          >
                            Request Payment
                          </button>
                          <button
                            onClick={() => handleOpenPayment(debt.userId, debt.amount, "upi")}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                          >
                            Settle Up
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenPayment(debt.userId, debt.amount, "upi")}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                          >
                            Pay via UPI
                          </button>
                          <button
                            onClick={() => handleOpenPayment(debt.userId, debt.amount, "cash")}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                          >
                            Record Cash
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols ~ 40%) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Transactions Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Transactions Ledger</h3>
                <span className="text-xs text-slate-500 font-medium">Settlement Activity</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">40%</span>
            </div>

            <div className="divide-y divide-slate-100">
              {settlements.slice(0, 5).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {item.type === "paid" && `Paid to ${item.person}`}
                      {item.type === "received" && `Received from ${item.person}`}
                      {item.type === "requested" && `Requested ${item.person}`}
                    </div>
                    <div className="text-[11px] text-slate-400">{item.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-900">
                      {formatINR(item.amount)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Settlement Optimizer Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-indigo-50/40 rounded-2xl border border-indigo-200/70 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-slate-900">AI Settlement Optimizer</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-indigo-900">AI Optimization Active:</span> Group
              debts have been simplified. Request <span className="font-bold">Saan Ghosh</span> to
              directly pay <span className="font-bold">Garvit Sharma ₹370</span> to reduce 2
              transactions!
            </p>

            <button
              onClick={() => {
                showToast("AI Optimization Plan shared to Room 204 WhatsApp group!", "success");
              }}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-white border border-indigo-200 hover:border-indigo-300 text-indigo-900 text-xs font-bold shadow-xs hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share Optimization with Roommates</span>
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
        mode={paymentMode}
      />

      <QrModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}
