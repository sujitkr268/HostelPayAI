"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  Bell,
  Shield,
  Smartphone,
  Save,
  RotateCcw,
  Sparkles,
  Check,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import QrModal from "@/components/Modals/QrModal";

export default function ProfilePage() {
  const {
    currentUser,
    updateProfile,
    resetDemoData,
    aiSparkleEnabled,
    setAiSparkleEnabled,
    showToast,
  } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    college: currentUser.college,
    hostelBlock: currentUser.hostelBlock,
    roomNumber: currentUser.roomNumber,
    upiId: currentUser.upiId,
    primaryBank: currentUser.primaryBank,
  });

  const [autoApprove, setAutoApprove] = useState(currentUser.autoApproveUnder500 ?? true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(currentUser.notifications?.whatsapp ?? true);
  const [pushNotifs, setPushNotifs] = useState(currentUser.notifications?.push ?? true);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      autoApproveUnder500: autoApprove,
      notifications: {
        ...currentUser.notifications,
        whatsapp: whatsappNotifs,
        push: pushNotifs,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-1">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>{" "}
            / <span className="text-slate-600">Profile & Settings</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Manage your hostel room details, UPI ID, notification preferences, and room settings.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-rose-200 bg-white text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Identity Card & QR (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 text-center">
            <div className="relative inline-block mx-auto mb-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/20 shadow-md mx-auto"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900">{formData.name}</h3>
            <p className="text-xs text-indigo-600 font-bold mt-0.5">Room 204, Tagore Hostel</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{formData.college}</p>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-left text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{formData.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Building className="w-4 h-4 text-slate-400" />
                <span>{formData.hostelBlock}</span>
              </div>
            </div>

            <button
              onClick={() => setQrModalOpen(true)}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Show My UPI QR</span>
            </button>
          </div>

          {/* Quick Hostel Status */}
          <div className="bg-indigo-50/60 rounded-2xl border border-indigo-100 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Hostel Block Status</span>
            </div>
            <div className="text-xs text-indigo-900/80 leading-relaxed">
              Your room is registered in <span className="font-bold">Tagore Hostel</span>. Dues and
              utilities are automatically grouped with Room 204 roommates.
            </div>
          </div>
        </div>

        {/* Right Column: Editable Settings (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Personal & Hostel Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  College / University
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hostel Block & Room
                </label>
                <input
                  type="text"
                  name="hostelBlock"
                  value={formData.hostelBlock}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Smart Preferences & Automation */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Automation & Notification Rules</h4>

              <div className="space-y-3">
                {/* Auto Approve under 500 */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Auto-Approve Micro Settlements
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Automatically mark roommate payments under ₹500 as approved
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoApprove(!autoApprove)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      autoApprove ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        autoApprove ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* WhatsApp Reminders */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">WhatsApp Dues Reminders</div>
                    <div className="text-[11px] text-slate-500">
                      Receive WhatsApp summary alerts when roommates split mess bills
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWhatsappNotifs(!whatsappNotifs)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      whatsappNotifs ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        whatsappNotifs ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* AI Sparkle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">AI Sparkle Smart Engine</div>
                    <div className="text-[11px] text-slate-500">
                      Suggest bulk food pooling, spending anomalies, and debt simplification
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiSparkleEnabled(!aiSparkleEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      aiSparkleEnabled ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                        aiSparkleEnabled ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <QrModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />
    </div>
  );
}
