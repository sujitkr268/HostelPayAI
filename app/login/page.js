"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet, Sparkles, ArrowRight, Lock, Mail, Building, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [emailOrRoom, setEmailOrRoom] = useState("sujit.kumar@hit.edu.in");
  const [password, setPassword] = useState("••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    showToast("Welcome back, Sujit! Signed in to Room 204.", "success");
    router.push("/");
  };

  const handleDemoLogin = () => {
    setEmailOrRoom("sujit.kumar@hit.edu.in");
    setPassword("hostel123");
    showToast("Signed in with Demo Student Account (Room 204 Tagore)", "success");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B132B]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-slate-900">HostelPay</span>
                <span className="text-2xl font-black text-indigo-600">AI</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                  AI
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Smart Hostel Expense Hub</div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Hostel Student Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your room balance, mess bills & split dues
          </p>
        </div>

        {/* 1-Click Demo Sign In */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mb-6 py-3 px-4 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs group"
        >
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Quick 1-Click Demo Login (Sujit, Room 204)</span>
          <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative mb-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-3 bg-white text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            or sign in with college ID
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Roll No / College Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={emailOrRoom}
                onChange={(e) => setEmailOrRoom(e.target.value)}
                required
                placeholder="e.g. 2024CS104 or sujit@hit.edu.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast("Password reset link sent to registered phone/email", "info")}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember room session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to HostelPay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          New student in hostel?{" "}
          <Link href="/register" className="font-bold text-indigo-600 hover:underline">
            Register your room
          </Link>
        </div>
      </div>
    </div>
  );
}
