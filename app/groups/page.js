"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  KeyRound,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Home,
  UtensilsCrossed,
  Compass,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatINR } from "@/lib/expenseSplitter";
import CreateGroupModal from "@/components/Modals/CreateGroupModal";

export default function GroupsPage() {
  const { groups, roommates, currentUser, setSelectedGroupId } = useApp();
  const [filterCategory, setFilterCategory] = useState("All");
  const [localSearch, setLocalSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("create");

  const categories = ["All", "Hostel Rooms", "Mess & Food", "Groceries", "Events"];

  const filteredGroups = groups.filter((g) => {
    const matchesCategory =
      filterCategory === "All" ||
      g.category?.toLowerCase() === filterCategory.toLowerCase() ||
      (filterCategory === "Events" && g.category?.toLowerCase().includes("event"));
    const matchesSearch =
      g.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      g.category?.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreate = () => {
    setModalTab("create");
    setModalOpen(true);
  };

  const handleOpenJoin = () => {
    setModalTab("join");
    setModalOpen(true);
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
            / <span className="text-slate-600">Groups</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Hostel & Roommate Groups
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Manage your shared expense circles, roommates, mess halls, and hostel blocks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenJoin}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs md:text-sm font-semibold shadow-xs hover:bg-slate-50 transition-all"
          >
            <KeyRound className="w-4 h-4 text-slate-500" />
            <span>Join with Code</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Filter Pills and Local Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search groups..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-400 outline-none text-slate-800"
          />
        </div>
      </div>

      {/* Group Cards Grid */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No hostel groups found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No group matches your search or filter. Try a different keyword or create a new group.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors inline-block mt-2"
          >
            Create New Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredGroups.map((group) => {
            // Find avatar images for group members
            const memberAvatars = [
              currentUser.avatar,
              ...roommates.slice(0, Math.min(3, (group.membersCount || 4) - 1)).map((r) => r.avatar),
            ];

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top: Category badge & Active indicator */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {group.category}
                    </span>
                    {group.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                        Current Room
                      </span>
                    )}
                  </div>

                  {/* Title & Members preview */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {group.name}
                      </h3>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        {group.membersCount || 4} members participating
                      </div>
                    </div>

                    {/* Stacked Avatars */}
                    <div className="flex -space-x-2 overflow-hidden shrink-0">
                      {memberAvatars.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt="Member"
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        />
                      ))}
                      {(group.membersCount || 4) > 4 && (
                        <div className="h-8 w-8 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                          +{group.membersCount - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metrics Box */}
                  <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Total Spend
                      </div>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        {formatINR(group.totalSpend)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Your Share
                      </div>
                      <div className="text-base font-black text-indigo-700 mt-0.5">
                        {formatINR(group.yourShare)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Balance Status & Link */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        group.balanceType === "owed"
                          ? "bg-emerald-100 text-emerald-800"
                          : group.balanceType === "owe"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {group.balanceStatus}
                    </span>
                  </div>

                  <Link
                    href={`/groups/${group.id}`}
                    onClick={() => setSelectedGroupId(group.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Group Create/Join Modal */}
      <CreateGroupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
      />
    </div>
  );
}
