"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Download,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Check,
  ArrowUpRight,
  PieChart as PieIcon,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AiInsightsPage() {
  const { aiSparkleEnabled, showToast } = useApp();
  const [selectedMonth, setSelectedMonth] = useState("October 2026");
  const [activeTooltip, setActiveTooltip] = useState(true);
  const [savingsPlanModal, setSavingsPlanModal] = useState(false);

  const handleExport = () => {
    showToast("Generating hostel monthly spending report PDF...", "info");
    setTimeout(() => {
      showToast("Report 'HostelPayAI_Oct2026.pdf' downloaded!", "success");
    }, 1500);
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
            / <span className="text-slate-600">AI Insights</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Spending Insights
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Smart breakdown of your shared hostel expenses and personalized savings tips.
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => showToast("Showing data for October 2026", "info")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedMonth}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-bold shadow-xs hover:bg-slate-50 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Personal Spend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Personal Spend</div>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-2xl font-black text-slate-900">₹5,420</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
              ▲ +4.2%
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">This Month vs last month</div>
        </div>

        {/* Avg. Daily Spend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Avg. Daily Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹174.80</div>
          <div className="text-xs text-slate-400 font-medium mt-1">Peak on weekends</div>
        </div>

        {/* Projected End of Month */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Projected End of Month</div>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-2xl font-black text-slate-900">₹6,800</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              Within budget
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">Remaining: ₹1,380 safe buffer</div>
        </div>
      </div>

      {/* Main Grid: Left Trend & Expenses (approx 65%), Right AI Cards (approx 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Spending Trend Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Monthly Spending Trend</h3>
              <span className="text-xs text-slate-400 font-medium">Daily & Spike Breakdown</span>
            </div>

            {/* SVG Visual Area Line Chart */}
            <div className="relative pt-6 pb-2">
              <div className="h-64 w-full relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 540 200"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                      <stop offset="70%" stopColor="#818CF8" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="35" y1="20" x2="520" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="35" y1="60" x2="520" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="35" y1="100" x2="520" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                  <line
                    x1="35"
                    y1="140"
                    x2="520"
                    y2="140"
                    stroke="#94A3B8"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <line x1="35" y1="180" x2="520" y2="180" stroke="#E2E8F0" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="5" y="24" fill="#64748B" fontSize="10" fontWeight="600">₹1,000</text>
                  <text x="12" y="64" fill="#64748B" fontSize="10" fontWeight="600">₹750</text>
                  <text x="12" y="104" fill="#64748B" fontSize="10" fontWeight="600">₹500</text>
                  <text x="12" y="144" fill="#64748B" fontSize="10" fontWeight="600">₹200</text>
                  <text x="25" y="184" fill="#64748B" fontSize="10" fontWeight="600">₹0</text>

                  {/* Vertical Subtle Daily Bars */}
                  {[
                    { x: 50, h: 40 },
                    { x: 70, h: 70 },
                    { x: 95, h: 25 },
                    { x: 120, h: 50 },
                    { x: 140, h: 30 },
                    { x: 165, h: 65 },
                    { x: 190, h: 90 },
                    { x: 215, h: 120, color: "#3B82F6" },
                    { x: 240, h: 160, color: "#4F46E5", special: true }, // Oct 14 Peak!
                    { x: 265, h: 80 },
                    { x: 290, h: 45 },
                    { x: 315, h: 110, color: "#10B981" }, // Weekend spike
                    { x: 340, h: 95 },
                    { x: 365, h: 70 },
                    { x: 390, h: 85 },
                    { x: 415, h: 115, color: "#10B981" },
                    { x: 440, h: 60 },
                    { x: 465, h: 40 },
                    { x: 490, h: 20 },
                  ].map((bar, i) => (
                    <rect
                      key={i}
                      x={bar.x}
                      y={180 - bar.h}
                      width={bar.special ? "10" : "8"}
                      height={bar.h}
                      rx="3"
                      fill={bar.color || "#CBD5E1"}
                      opacity={bar.special ? "1" : "0.75"}
                    />
                  ))}

                  {/* Area fill under curve */}
                  <path
                    d="M 50 160 
                       Q 75 80, 100 95 
                       T 160 140 
                       T 210 110 
                       T 245 20 
                       T 285 90 
                       T 330 110 
                       T 370 70 
                       T 415 80 
                       T 470 140 
                       T 510 170 
                       L 510 180 L 50 180 Z"
                    fill="url(#areaGradient)"
                  />

                  {/* Smooth spline curve line */}
                  <path
                    d="M 50 160 
                       Q 75 80, 100 95 
                       T 160 140 
                       T 210 110 
                       T 245 20 
                       T 285 90 
                       T 330 110 
                       T 370 70 
                       T 415 80 
                       T 470 140 
                       T 510 170"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Peak Marker Point at Oct 14 */}
                  <circle cx="245" cy="20" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* Floating Tooltip at Oct 15 peak */}
                {activeTooltip && (
                  <div
                    className="absolute z-10 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xl text-xs font-semibold cursor-pointer border border-slate-700 pointer-events-none"
                    style={{ left: "47%", top: "8%" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-cyan-300">Oct 15: ₹2,400</span>
                      <span className="text-slate-300 font-normal">(Hostel Mess Bill)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* X Axis Dates */}
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-6 pt-2">
                <span>Oct 1</span>
                <span>Oct 6</span>
                <span>Oct 10</span>
                <span className="text-indigo-600 font-bold">Oct 15</span>
                <span>Oct 20</span>
                <span>Oct 25</span>
                <span>Oct 31</span>
              </div>
            </div>
          </div>

          {/* Recent Highlighted Expenses Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Recent Highlighted Expenses
            </h3>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              {[
                {
                  title: "Hostel Mess - Monthly Bill",
                  date: "Oct 15",
                  amount: "₹2,400",
                  category: "Mess & Food",
                  tag: "High Spend ⚠️",
                  tagClass: "bg-amber-50 text-amber-700 border-amber-200",
                },
                {
                  title: "Electricity Bill (AC & Geyser)",
                  date: "Oct 12",
                  amount: "₹1,200",
                  category: "Utilities",
                  tag: "Monthly Bill",
                  tagClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
                },
                {
                  title: "Weekend Groceries & Snacks",
                  date: "Oct 10",
                  amount: "₹850",
                  category: "Groceries",
                  tag: "Group Split",
                  tagClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
                },
                {
                  title: "Evening Snacks & Chai",
                  date: "Oct 08",
                  amount: "₹450",
                  category: "Mess & Food",
                  tag: "Group Split",
                  tagClass: "bg-amber-50 text-amber-700 border-amber-200",
                },
                {
                  title: "Shared Stationery & Lab Manuals",
                  date: "Oct 06",
                  amount: "₹350",
                  category: "Supplies",
                  tag: "College Supplies",
                  tagClass: "bg-purple-50 text-purple-700 border-purple-200",
                },
                {
                  title: "Drinking Water (20L Cans x 10)",
                  date: "Oct 04",
                  amount: "₹300",
                  category: "Utilities",
                  tag: "Fixed Cost",
                  tagClass: "bg-blue-50 text-blue-700 border-blue-200",
                },
                {
                  title: "Room Cleaning Supplies",
                  date: "Oct 02",
                  amount: "₹280",
                  category: "Supplies",
                  tag: "Fixed Cost",
                  tagClass: "bg-slate-100 text-slate-700 border-slate-200",
                },
              ].map((exp, i) => (
                <div
                  key={i}
                  className="py-3.5 flex items-center justify-between gap-4 text-xs hover:bg-slate-50 rounded-xl px-2 transition-colors"
                >
                  <div className="min-w-36">
                    <div className="font-bold text-slate-900">{exp.title}</div>
                  </div>
                  <div className="text-slate-400 font-medium">{exp.date}</div>
                  <div className="font-black text-slate-900">{exp.amount}</div>
                  <div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold text-[11px]">
                      {exp.category}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${exp.tagClass}`}
                    >
                      {exp.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Personalized Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  AI Personalized Recommendations
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span>AI Sparkle ✨ Sparkle</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Rec 1 */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🍔</span> Highest Spending Category
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <span className="font-semibold text-slate-800">Food & Snacks</span> comprises 54%
                  of your budget (<span className="font-bold">₹2,926</span>). You spent 18% more on
                  late-night bites this week compared to last week.
                </p>
              </div>

              {/* Rec 2 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>📈</span> Comparison with Last Month
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <span className="font-semibold text-slate-800">Slightly above average:</span> Your
                  current non-essential spending is ₹650 higher than September. You can save by
                  sticking to mess meals on weekdays.
                </p>
              </div>

              {/* Rec 3 */}
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>📦</span> Group Savings Opportunity
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <span className="font-semibold text-slate-800">Canteen & Food Pooling:</span> Prakalpa S. and
                  Saan G. often order evening snacks and chai from the college canteen. Pooling orders could
                  save Room 204 around <span className="font-bold text-indigo-900">₹450</span> in
                  delivery and mess fees this month.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSavingsPlanModal(true)}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all text-center"
            >
              Generate Custom Savings Plan
            </button>
          </div>

          {/* Category-wise Spending Donut */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <h3 className="text-base font-bold text-slate-900 mb-4">Category-wise Spending</h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* SVG Donut */}
              <div className="relative w-40 h-40 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="16" />

                  {/* Food: 54% (approx 129 deg -> circumference = 238.76 -> strokeDasharray) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#1E3A8A" // deep blue
                    strokeWidth="16"
                    strokeDasharray="128.9 238.8"
                    strokeDashoffset="0"
                  />

                  {/* Utilities: 28% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#0284C7" // cyan/light blue
                    strokeWidth="16"
                    strokeDasharray="66.8 238.8"
                    strokeDashoffset="-128.9"
                  />

                  {/* Travel: 10% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10B981" // green
                    strokeWidth="16"
                    strokeDasharray="23.8 238.8"
                    strokeDashoffset="-195.7"
                  />

                  {/* Entertainment: 8% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F59E0B" // amber
                    strokeWidth="16"
                    strokeDasharray="19.1 238.8"
                    strokeDashoffset="-219.5"
                  />
                </svg>

                {/* Donut inner labels */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-sm font-black text-slate-900">₹5,420</span>
                </div>
              </div>

              {/* Legend with exact amounts & colors */}
              <div className="space-y-3 flex-1 w-full text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-[#1E3A8A]" />
                    <span>Food</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">₹2,926</span>
                    <span className="text-slate-400 font-medium">54%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-[#0284C7]" />
                    <span>Utilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">₹1,517</span>
                    <span className="text-slate-400 font-medium">28%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span>Travel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">₹542</span>
                    <span className="text-slate-400 font-medium">10%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <span>Entertainment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">₹435</span>
                    <span className="text-slate-400 font-medium">8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Plan Modal */}
      {savingsPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Custom Hostel Savings Plan</h3>
              </div>
              <button
                onClick={() => setSavingsPlanModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on Room 204's past 30 days of shared bills, here is your 3-step actionable
              budget goal for November:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-emerald-900">1. Weekend Canteen & Food Pooling</div>
                <div className="text-emerald-800 text-[11px] mt-0.5">
                  Combine evening snack orders with Prakalpa & Saan: Est. savings ₹450/month.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <div className="font-bold text-indigo-900">2. Night AC & Geyser Timer Setting</div>
                <div className="text-indigo-800 text-[11px] mt-0.5">
                  Run room AC on 25°C with 4-hour sleep timer: Est. savings ₹800/month.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="font-bold text-amber-900">3. Monthly Wholesale Grocery Supplies</div>
                <div className="text-amber-800 text-[11px] mt-0.5">
                  Buy noodles, milk, tea, and cleaning items in bulk: Est. savings ₹350/person.
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setSavingsPlanModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast("Saved custom savings plan to your profile goals!", "success");
                  setSavingsPlanModal(false);
                }}
                className="flex-2 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
              >
                Adopt Savings Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
