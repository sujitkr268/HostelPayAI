"use client";

import React, { useState } from "react";
import { X, Copy, Check, QrCode, Camera, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function QrModal({ isOpen, onClose }) {
  const { currentUser, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("my-qr"); // 'my-qr' | 'scan'
  const [simulatedScanSuccess, setSimulatedScanSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentUser.upiId);
    }
    setCopied(true);
    showToast("UPI ID copied to clipboard: " + currentUser.upiId, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setSimulatedScanSuccess(true);
    setTimeout(() => {
      showToast("Scanned Prakalpa Sen's QR (prakalpa@okhdfc)", "success");
      setSimulatedScanSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Hostel UPI QR</h3>
            <p className="text-xs text-slate-500">Fast roommate settlement</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 pb-2">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("my-qr")}
              className={`py-2 rounded-xl transition-all ${
                activeTab === "my-qr"
                  ? "bg-white text-indigo-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My UPI QR
            </button>
            <button
              onClick={() => setActiveTab("scan")}
              className={`py-2 rounded-xl transition-all ${
                activeTab === "scan"
                  ? "bg-white text-indigo-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Scan QR
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "my-qr" ? (
          <div className="p-6 pt-2 flex flex-col items-center text-center">
            {/* Visual QR Code Generator */}
            <div className="p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-md my-3 relative group">
              <svg
                className="w-48 h-48"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG Mock QR Code */}
                <rect width="100" height="100" fill="white" />
                {/* Top-Left Finder */}
                <rect x="10" y="10" width="24" height="24" fill="#0B132B" rx="4" />
                <rect x="14" y="14" width="16" height="16" fill="white" rx="2" />
                <rect x="18" y="18" width="8" height="8" fill="#4F46E5" rx="1" />
                {/* Top-Right Finder */}
                <rect x="66" y="10" width="24" height="24" fill="#0B132B" rx="4" />
                <rect x="70" y="14" width="16" height="16" fill="white" rx="2" />
                <rect x="74" y="18" width="8" height="8" fill="#4F46E5" rx="1" />
                {/* Bottom-Left Finder */}
                <rect x="10" y="66" width="24" height="24" fill="#0B132B" rx="4" />
                <rect x="14" y="70" width="16" height="16" fill="white" rx="2" />
                <rect x="18" y="74" width="8" height="8" fill="#4F46E5" rx="1" />
                {/* Data blocks */}
                <rect x="38" y="14" width="6" height="6" fill="#0B132B" rx="1" />
                <rect x="48" y="14" width="8" height="6" fill="#0B132B" rx="1" />
                <rect x="38" y="24" width="10" height="6" fill="#4F46E5" rx="1" />
                <rect x="52" y="24" width="6" height="6" fill="#0B132B" rx="1" />
                <rect x="14" y="38" width="8" height="8" fill="#0B132B" rx="1" />
                <rect x="26" y="38" width="6" height="6" fill="#4F46E5" rx="1" />
                <rect x="36" y="38" width="8" height="8" fill="#0B132B" rx="1" />
                <rect x="48" y="36" width="8" height="12" fill="#06B6D4" rx="2" />
                <rect x="60" y="38" width="12" height="6" fill="#0B132B" rx="1" />
                <rect x="76" y="38" width="8" height="8" fill="#4F46E5" rx="1" />
                <rect x="14" y="50" width="12" height="8" fill="#4F46E5" rx="1" />
                <rect x="30" y="50" width="10" height="6" fill="#0B132B" rx="1" />
                <rect x="44" y="52" width="12" height="6" fill="#0B132B" rx="1" />
                <rect x="62" y="48" width="10" height="10" fill="#06B6D4" rx="2" />
                <rect x="76" y="50" width="14" height="6" fill="#0B132B" rx="1" />
                <rect x="38" y="66" width="8" height="10" fill="#0B132B" rx="1" />
                <rect x="50" y="66" width="10" height="6" fill="#4F46E5" rx="1" />
                <rect x="64" y="66" width="8" height="8" fill="#0B132B" rx="1" />
                <rect x="76" y="66" width="14" height="10" fill="#0B132B" rx="1" />
                <rect x="38" y="80" width="12" height="8" fill="#0B132B" rx="1" />
                <rect x="54" y="76" width="8" height="14" fill="#06B6D4" rx="1" />
                <rect x="66" y="78" width="20" height="8" fill="#4F46E5" rx="1" />
                {/* Center Badge */}
                <circle cx="50" cy="50" r="8" fill="#0B132B" />
                <text x="50" y="53" textAnchor="middle" fill="#06B6D4" fontSize="7" fontWeight="bold">₹</text>
              </svg>
            </div>

            <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{currentUser.upiId}</div>

            <button
              onClick={handleCopy}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Copied!" : "Copy UPI ID"}</span>
            </button>

            <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Compatible with Google Pay, PhonePe, Paytm, BHIM</span>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative w-56 h-56 bg-slate-900 rounded-2xl flex flex-col items-center justify-center border-2 border-indigo-500/50 overflow-hidden shadow-inner">
              <Camera className="w-10 h-10 text-indigo-400 mb-2" />
              <div className="text-xs text-slate-300 font-medium px-4">
                Align roommate's UPI QR code within frame
              </div>
              {/* Scan beam animation */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-lg shadow-cyan-400 animate-pulse top-1/2" />
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={simulatedScanSuccess}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20"
            >
              {simulatedScanSuccess ? "Detecting QR..." : "Simulate Roommate QR Scan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
