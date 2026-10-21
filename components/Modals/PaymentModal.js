"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/expenseSplitter";
import {
  X,
  ShieldAlert,
  Smartphone,
  Banknote,
  CheckCircle,
  QrCode,
  ArrowRight,
} from "lucide-react";

export default function PaymentModal({ isOpen, onClose, defaultRoommateId, defaultAmount, mode = "upi" }) {
  const { roommates, roommateDebts, recordSettlement, recordReceivedPayment } = useApp();

  const [selectedUserId, setSelectedUserId] = useState(defaultRoommateId || roommates[0]?.id || "user-4");
  const [amount, setAmount] = useState(defaultAmount || "500");
  const [paymentType, setPaymentType] = useState(mode); // 'upi' | 'cash'
  const [selectedApp, setSelectedApp] = useState("gpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [note, setNote] = useState("Hostel expense settlement");

  if (!isOpen) return null;

  const targetRoommate = roommates.find((r) => r.id === selectedUserId) || roommates[0];
  const targetDebt = roommateDebts.find((d) => d.userId === selectedUserId);

  const isSujitReceiving = targetDebt?.type === "owed_to_you";

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);

      const appLabels = {
        gpay: "Google Pay",
        phonepe: "PhonePe",
        paytm: "Paytm",
        bhim: "BHIM UPI",
      };

      const methodLabel = paymentType === "cash" ? "Cash Recorded" : `UPI (${appLabels[selectedApp]})`;

      if (isSujitReceiving) {
        recordReceivedPayment({
          userId: selectedUserId,
          amount: Number(amount),
          method: methodLabel,
        });
      } else {
        recordSettlement({
          userId: selectedUserId,
          amount: Number(amount),
          method: methodLabel,
          note,
        });
      }

      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isSujitReceiving ? "Confirm Payment Receipt" : "Settle Payment"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Simulated hostel transaction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Simulated Disclaimer Banner */}
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-bold">SIMULATED ENVIRONMENT:</span> No actual money is moved. This updates your hostel ledger and balances locally.
          </div>
        </div>

        {isDone ? (
          <div className="p-8 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Settlement Recorded!</h4>
            <p className="text-sm text-slate-600">
              {formatINR(Number(amount))} settled with {targetRoommate.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSimulatePayment} className="p-6 space-y-4">
            {/* Person selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Roommate
              </label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={targetRoommate.avatar}
                  alt={targetRoommate.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900">{targetRoommate.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{targetRoommate.upiId}</div>
                </div>
                {targetDebt && (
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        targetDebt.type === "owed_to_you"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {targetDebt.statusText}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentType("upi")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold border transition-all ${
                    paymentType === "upi"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Instant UPI
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("cash")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-bold border transition-all ${
                    paymentType === "cash"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  Cash in Hand
                </button>
              </div>
            </div>

            {/* UPI Apps selection if UPI */}
            {paymentType === "upi" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Simulate with App
                </label>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { id: "gpay", label: "GPay", color: "text-blue-600" },
                    { id: "phonepe", label: "PhonePe", color: "text-purple-600" },
                    { id: "paytm", label: "Paytm", color: "text-cyan-600" },
                    { id: "bhim", label: "BHIM", color: "text-amber-600" },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedApp(app.id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        selectedApp === app.id
                          ? "border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <div className={`font-black text-sm ${app.color}`}>{app.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Settlement Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount to Settle (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-2xl text-base font-bold text-slate-900 outline-none transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Note / Description
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 outline-none transition-all"
                placeholder="e.g. Cleared biryani bill"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing UPI...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Settlement (Simulated)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
