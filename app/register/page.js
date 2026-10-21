"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet, ArrowRight, User, Mail, Phone, Building, Lock, CreditCard } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function RegisterPage() {
  const router = useRouter();
  const { updateProfile, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",

    phone: "",
    college: "HIT Haldia (Haldia Institute Of Technology+)",
    hostelBlock: "Tagore Hostel",
    roomNumber: "204",
    upiId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast("Please fill in required fields", "error");
      return;
    }

    updateProfile({
      name: formData.name,
      shortName: formData.name.split(" ")[0] + (formData.name.split(" ")[1] ? ` ${formData.name.split(" ")[1][0]}.` : ""),
      email: formData.email,
      phone: formData.phone || "+91 98765 43210",
      college: formData.college,
      hostelBlock: `${formData.hostelBlock}, Room ${formData.roomNumber}`,
      roomNumber: formData.roomNumber,
      upiId: formData.upiId || `${formData.email.split("@")[0]}@upi`,
    });

    showToast("Registration successful! Welcome to HostelPayAI.", "success");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B132B]">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 my-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-slate-900">HostelPay</span>
              <span className="text-2xl font-black text-indigo-600">AI</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Create Student Account</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Join your room circle and manage shared bills effortlessly
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Sujit Kumar"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="sujit@hit.edu.in"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hostel Block
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="hostelBlock"
                  value={formData.hostelBlock}
                  onChange={handleChange}
                  placeholder="e.g. Tagore Hostel"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Room Number
              </label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 204"
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                UPI ID (for payments)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="name@upi"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
