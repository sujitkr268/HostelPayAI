"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users,
  PlusCircle,
  Calendar,
  CreditCard,
  UserPlus,
  ArrowLeft,
  CheckCircle,
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  Home,
  Check,
  Share2,
  Mail,
  Copy,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/expenseSplitter";
import PaymentModal from "@/components/Modals/PaymentModal";

export default function GroupDetailsPage() {
  const params = useParams();
  const groupId = params?.id || "group-1";

  const {
    groups,
    expenses,
    roommates,
    roommateDebts,
    currentUser,
    inviteMember,
    requestPaymentReminder,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState("expenses"); // 'expenses' | 'members' | 'balances'
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const group = groups.find((g) => g.id === groupId) || groups[0];

  // Group specific expenses
  const groupExpenses = expenses.filter(
    (e) => e.groupId === group.id || group.id === "group-1" // Fallback to all hostel expenses if demo group
  );

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
        return <Home className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteInput.trim()) return;
    inviteMember(group.id, inviteInput.trim());
    setInviteInput("");
    setInviteModalOpen(false);
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`https://hostelpay.ai/join/${group.shortName?.replace(/\s+/g, "") || "ROOM204"}`);
    }
    showToast("Invite link copied to clipboard!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <Link href="/groups" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Groups</span>
            </Link>{" "}
            / <span className="text-slate-600">{group.name}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {group.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {group.category}
            </span>
            <span className="text-xs text-slate-400">
              {group.membersCount || 4} hostel members
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs md:text-sm font-semibold shadow-xs hover:bg-slate-50 transition-all"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            <span>Invite</span>
          </button>
          <Link
            href={`/add-expense?groupId=${group.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Group Total Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatINR(group.totalSpend)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Across {groupExpenses.length} logged expenses
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Your Calculated Share</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {formatINR(group.yourShare)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            ~25% of total room expenses
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Current Status</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {group.balanceStatus || "Settled"}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Active in Room 204, Tagore Hostel
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="flex items-center gap-8 px-6 border-b border-slate-100 text-xs font-bold text-slate-500">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`py-4 relative transition-colors ${
              activeTab === "expenses" ? "text-indigo-600" : "hover:text-slate-800"
            }`}
          >
            Expenses ({groupExpenses.length})
            {activeTab === "expenses" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`py-4 relative transition-colors ${
              activeTab === "members" ? "text-indigo-600" : "hover:text-slate-800"
            }`}
          >
            Members ({group.membersCount || 4})
            {activeTab === "members" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("balances")}
            className={`py-4 relative transition-colors ${
              activeTab === "balances" ? "text-indigo-600" : "hover:text-slate-800"
            }`}
          >
            Roommate Balances
            {activeTab === "balances" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: Expenses */}
        {activeTab === "expenses" && (
          <div className="p-6">
            {groupExpenses.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <div>No expenses logged in this group yet.</div>
                <Link
                  href={`/add-expense?groupId=${group.id}`}
                  className="inline-block text-indigo-600 font-bold hover:underline"
                >
                  + Add First Expense
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {groupExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 -mx-3 px-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {getCategoryIcon(exp.category)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{exp.title}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                          {exp.date} • Paid by{" "}
                          <span className="font-semibold text-slate-700">{exp.payerName}</span> •{" "}
                          {exp.splitMethod || "Equal"} Split
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">
                          {formatINR(exp.amount)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {exp.splitSummary || `Your share: ${formatINR(Math.round(exp.amount / 4))}`}
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          exp.statusBadge === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : exp.statusBadge === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : exp.statusBadge === "you_owe"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {exp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Members */}
        {activeTab === "members" && (
          <div className="p-6 divide-y divide-slate-100">
            {/* Sujit K. (You) */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {currentUser.name}
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                      You
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{currentUser.upiId}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Admin
              </span>
            </div>

            {/* Other Roommates */}
            {roommates.map((r) => (
              <div key={r.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{r.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Room {r.room} • {r.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">Member</span>
                  <button
                    onClick={() => {
                      setSelectedUser(r.id);
                      setPaymentModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Settle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Balances */}
        {activeTab === "balances" && (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs text-indigo-950 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Group Settlement Status:</span> Debts in{" "}
                <span className="font-semibold">{group.name}</span> are tracked relative to room
                purchases. Click settle or remind below to resolve outstanding amounts.
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {roommateDebts.map((b) => (
                <div key={b.userId} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{b.name}</div>
                    <div
                      className={`text-[11px] font-semibold ${
                        b.type === "owed_to_you" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {b.statusText}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.type === "owed_to_you" ? (
                      <button
                        onClick={() => requestPaymentReminder(b.userId)}
                        className="px-3 py-1 rounded-xl border border-indigo-200 text-indigo-600 text-xs font-bold hover:bg-indigo-50"
                      >
                        Request Payment
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedUser(b.userId);
                          setPaymentModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs"
                      >
                        Pay via UPI
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Invite Roommate to Group</h3>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number or Email
                </label>
                <input
                  type="text"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  placeholder="e.g. +91 98765 00000 or roommate@college.edu"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Shareable Link Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-600 font-mono truncate">
                  hostelpay.ai/join/{group.shortName?.replace(/\s+/g, "") || "ROOM204"}
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultRoommateId={selectedUser}
      />
    </div>
  );
}
