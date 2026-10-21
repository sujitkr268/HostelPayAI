"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast.visible) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const bgStyles = {
    success: "border-emerald-200 bg-white text-slate-800 shadow-lg shadow-emerald-500/10",
    error: "border-rose-200 bg-white text-slate-800 shadow-lg shadow-rose-500/10",
    info: "border-indigo-200 bg-white text-slate-800 shadow-lg shadow-indigo-500/10",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
          bgStyles[toast.type] || bgStyles.info
        } max-w-md backdrop-blur-md`}
      >
        {icons[toast.type] || icons.info}
        <div className="text-sm font-medium pr-2">{toast.message}</div>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
