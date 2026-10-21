"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UtensilsCrossed,
  ShoppingBag,
  Zap,
  Home,
  MoreHorizontal,
  Calendar,
  Users,
  Check,
  AlertCircle,
  PlusCircle,
  Calculator,
  Percent,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  calculateEqualSplit,
  calculateExactSplit,
  calculatePercentageSplit,
  formatINR,
} from "@/lib/expenseSplitter";

function AddExpenseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryGroupId = searchParams.get("groupId");

  const {
    groups,
    roommates,
    currentUser,
    selectedGroupId,
    addExpense,
    showToast,
  } = useApp();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Mess & Food");
  const [date, setDate] = useState("Today, Oct 18");
  const [paidBy, setPaidBy] = useState("user-1"); // Default: Sujit (current user)
  const [groupId, setGroupId] = useState(queryGroupId || selectedGroupId || "group-1");
  const [splitMethod, setSplitMethod] = useState("equal"); // 'equal' | 'exact' | 'percentage'

  // Roommate participants: default all 4 members
  const allParticipantIds = ["user-1", "user-2", "user-3", "user-4"];
  const [selectedParticipants, setSelectedParticipants] = useState(allParticipantIds);

  // Custom split values map: userId -> string value
  const [customAmounts, setCustomAmounts] = useState({});
  const [customPercentages, setCustomPercentages] = useState({});

  const allMembers = [currentUser, ...roommates];

  const categories = [
    { id: "Mess & Food", label: "Mess & Food", icon: UtensilsCrossed, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "Groceries", label: "Groceries", icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { id: "Electricity", label: "Electricity", icon: Zap, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "Rent", label: "Rent", icon: Home, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { id: "Other", label: "Other", icon: MoreHorizontal, color: "text-purple-600 bg-purple-50 border-purple-200" },
  ];

  // Toggle participant
  const handleToggleParticipant = (userId) => {
    if (selectedParticipants.includes(userId)) {
      if (selectedParticipants.length <= 1) {
        showToast("At least one person must be included in the expense split", "error");
        return;
      }
      setSelectedParticipants((prev) => prev.filter((id) => id !== userId));
    } else {
      setSelectedParticipants((prev) => [...prev, userId]);
    }
  };

  // Calculate live splits
  const numAmount = Number(amount) || 0;

  let calculatedSplits = [];
  let isCustomValid = true;
  let customDiff = 0;

  if (splitMethod === "equal") {
    calculatedSplits = calculateEqualSplit(numAmount, selectedParticipants);
  } else if (splitMethod === "exact") {
    const res = calculateExactSplit(numAmount, customAmounts);
    calculatedSplits = res.splits;
    isCustomValid = numAmount > 0 ? res.isValid : true;
    customDiff = res.diff;
  } else if (splitMethod === "percentage") {
    const res = calculatePercentageSplit(numAmount, customPercentages);
    calculatedSplits = res.splits;
    isCustomValid = numAmount > 0 ? res.isValid : true;
    customDiff = res.diff;
  }

  // Pre-fill custom splits when switching tabs
  const handleSwitchSplitMethod = (method) => {
    setSplitMethod(method);
    if (numAmount > 0 && selectedParticipants.length > 0) {
      if (method === "exact") {
        const perPerson = Math.floor(numAmount / selectedParticipants.length);
        const map = {};
        selectedParticipants.forEach((id, i) => {
          map[id] = i === 0 ? numAmount - perPerson * (selectedParticipants.length - 1) : perPerson;
        });
        setCustomAmounts(map);
      } else if (method === "percentage") {
        const pct = Math.floor(100 / selectedParticipants.length);
        const map = {};
        selectedParticipants.forEach((id, i) => {
          map[id] = i === 0 ? 100 - pct * (selectedParticipants.length - 1) : pct;
        });
        setCustomPercentages(map);
      }
    }
  };

  const handleCustomAmountChange = (userId, val) => {
    setCustomAmounts((prev) => ({ ...prev, [userId]: Number(val) || 0 }));
  };

  const handleCustomPercentageChange = (userId, val) => {
    setCustomPercentages((prev) => ({ ...prev, [userId]: Number(val) || 0 }));
  };

  // Submit expense
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please enter an expense title", "error");
      return;
    }

    if (!numAmount || numAmount <= 0) {
      showToast("Please enter a valid expense amount in INR", "error");
      return;
    }

    if (splitMethod !== "equal" && !isCustomValid) {
      showToast(`Custom split is unbalanced (Difference: ₹${Math.abs(customDiff)})`, "error");
      return;
    }

    const payer = allMembers.find((m) => m.id === paidBy);

    const newExpense = {
      title: title.trim(),
      amount: numAmount,
      category,
      date,
      groupId,
      paidBy,
      payerName: paidBy === "user-1" ? "You (Sujit K.)" : payer?.name || "Roommate",
      splitMethod: splitMethod === "equal" ? "Equal" : splitMethod === "exact" ? "Custom Exact" : "Percentage",
      splits: calculatedSplits,
      status: paidBy === "user-1" ? "Paid" : "You owe share",
      statusBadge: paidBy === "user-1" ? "paid" : "you_owe",
      splitSummary:
        paidBy === "user-1"
          ? `You paid ${formatINR(numAmount)}`
          : `Paid by ${payer?.shortName || payer?.name}`,
    };

    addExpense(newExpense);
    router.push("/settle");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-1">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>{" "}
          / <span className="text-slate-600">Add Expense</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Shared Expense</h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          Split mess bills, room groceries, electricity, and utilities with roommates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          {/* Expense Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mess Bill - Oct, Wi-Fi, Groceries"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Amount in INR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Total Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payer and Group Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payer Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Paid By
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="user-1">You (Sujit Kumar)</option>
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} (Room {r.room})
                  </option>
                ))}
              </select>
            </div>

            {/* Group Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hostel Group
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Split Method Tabs */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Split Method
            </label>
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleSwitchSplitMethod("equal")}
                className={`py-2 flex items-center justify-center gap-1.5 rounded-xl transition-all ${
                  splitMethod === "equal"
                    ? "bg-white text-indigo-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Equal Split
              </button>
              <button
                type="button"
                onClick={() => handleSwitchSplitMethod("exact")}
                className={`py-2 flex items-center justify-center gap-1.5 rounded-xl transition-all ${
                  splitMethod === "exact"
                    ? "bg-white text-indigo-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Custom Exact
              </button>
              <button
                type="button"
                onClick={() => handleSwitchSplitMethod("percentage")}
                className={`py-2 flex items-center justify-center gap-1.5 rounded-xl transition-all ${
                  splitMethod === "percentage"
                    ? "bg-white text-indigo-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                Percentage
              </button>
            </div>
          </div>

          {/* Roommates Included in Split */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Split Among ({selectedParticipants.length} selected)
              </label>
              <button
                type="button"
                onClick={() => setSelectedParticipants(allParticipantIds)}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Select All
              </button>
            </div>

            <div className="space-y-2">
              {allMembers.slice(0, 4).map((member) => {
                const isSelected = selectedParticipants.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? "bg-indigo-50/30 border-indigo-200"
                        : "bg-slate-50/50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div
                      onClick={() => handleToggleParticipant(member.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isSelected ? "bg-indigo-600 text-white" : "border border-slate-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {member.id === "user-1" ? "You (Sujit Kumar)" : member.name}
                        </div>
                        <div className="text-[10px] text-slate-400">Room {member.room || "204"}</div>
                      </div>
                    </div>

                    {/* Inputs if custom split */}
                    {splitMethod === "exact" && isSelected && (
                      <div className="flex items-center gap-1.5 w-32">
                        <span className="text-xs font-bold text-slate-500">₹</span>
                        <input
                          type="number"
                          step="any"
                          value={customAmounts[member.id] || ""}
                          onChange={(e) => handleCustomAmountChange(member.id, e.target.value)}
                          placeholder="0"
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}

                    {splitMethod === "percentage" && isSelected && (
                      <div className="flex items-center gap-1.5 w-28">
                        <input
                          type="number"
                          step="any"
                          value={customPercentages[member.id] || ""}
                          onChange={(e) => handleCustomPercentageChange(member.id, e.target.value)}
                          placeholder="0"
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                    )}

                    {/* Equal share indicator */}
                    {splitMethod === "equal" && isSelected && (
                      <span className="text-xs font-bold text-slate-700">
                        {numAmount > 0
                          ? formatINR(Math.round(numAmount / selectedParticipants.length))
                          : "₹0"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Summary & Action Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Expense Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Expense Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Title:</span>
                <span className="font-bold text-slate-800">{title || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="font-bold text-slate-800">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Total Amount:</span>
                <span className="font-black text-slate-900 text-sm">
                  {formatINR(numAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Paid by:</span>
                <span className="font-bold text-slate-800">
                  {paidBy === "user-1"
                    ? "You (Sujit K.)"
                    : allMembers.find((m) => m.id === paidBy)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Split Type:</span>
                <span className="font-bold text-indigo-600 capitalize">{splitMethod} Split</span>
              </div>
            </div>

            {/* Split Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Individual Roommate Shares
              </div>
              <div className="space-y-1.5">
                {calculatedSplits.map((s) => {
                  const person = allMembers.find((m) => m.id === s.userId);
                  return (
                    <div key={s.userId} className="flex justify-between text-xs py-1">
                      <span className="text-slate-600">
                        {person?.id === "user-1" ? "You" : person?.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatINR(Math.round(s.amount))}{" "}
                        <span className="text-slate-400 font-normal">({s.percentage}%)</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Imbalance warning if custom split is invalid */}
            {splitMethod !== "equal" && numAmount > 0 && !isCustomValid && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>
                  {splitMethod === "exact"
                    ? `Total mismatch: ${formatINR(Math.abs(customDiff))} ${customDiff > 0 ? "under" : "over"}`
                    : `Percentage mismatch: ${customDiff}% remaining`}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="pt-4 space-y-2.5">
              <button
                type="submit"
                disabled={!isCustomValid && splitMethod !== "equal"}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Save Expense & Split</span>
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AddExpensePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          Loading expense form...
        </div>
      }
    >
      <AddExpenseForm />
    </Suspense>
  );
}
