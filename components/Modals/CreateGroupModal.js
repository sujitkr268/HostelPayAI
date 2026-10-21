"use client";

import React, { useState } from "react";
import { X, Users, KeyRound, Check, Sparkles, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CreateGroupModal({ isOpen, onClose, initialTab = "create" }) {
  const { roommates, createGroup, joinGroupByCode, showToast } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab); // 'create' | 'join'
  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("Hostel Rooms");
  const [selectedMembers, setSelectedMembers] = useState(["user-2", "user-3"]);
  const [joinCode, setJoinCode] = useState("");

  if (!isOpen) return null;

  const handleToggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      showToast("Please enter a group name", "error");
      return;
    }

    createGroup({
      name: groupName.trim(),
      category,
      memberIds: selectedMembers,
    });

    setGroupName("");
    onClose();
  };

  const handleJoinGroup = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      showToast("Please enter a valid join code", "error");
      return;
    }

    const ok = joinGroupByCode(joinCode.trim());
    if (ok) {
      setJoinCode("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === "create" ? "Create Hostel Group" : "Join Existing Group"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Split mess, room rent, and trip dues
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-2 flex items-center justify-center gap-1.5 rounded-xl transition-all ${
                activeTab === "create"
                  ? "bg-white text-indigo-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              New Group
            </button>
            <button
              onClick={() => setActiveTab("join")}
              className={`py-2 flex items-center justify-center gap-1.5 rounded-xl transition-all ${
                activeTab === "join"
                  ? "bg-white text-indigo-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Join with Code
            </button>
          </div>
        </div>

        {activeTab === "create" ? (
          <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Room 204 (Tagore Hostel)"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["Hostel Rooms", "Mess & Food", "Events & Trips", "Utilities"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded-xl border font-medium text-left transition-all ${
                      category === cat
                        ? "bg-indigo-50/80 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500/30"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Add Roommates (Room 204)
              </label>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {roommates.map((r) => {
                  const isChecked = selectedMembers.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleToggleMember(r.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-indigo-50/40 border-indigo-200 ring-1 ring-indigo-500/20"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-300"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{r.name}</div>
                          <div className="text-[10px] text-slate-400">Room {r.room}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isChecked ? "bg-indigo-600 text-white" : "border border-slate-300"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create Group
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleJoinGroup} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Hostel Group Join Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. ROOM204"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:bg-white focus:border-indigo-500 outline-none uppercase transition-all"
                required
              />
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Ask your roommate or group admin for their 6-character room code.
              </p>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs text-indigo-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Quick Demo Codes
              </div>
              <div className="flex gap-2 pt-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setJoinCode("ROOM204")}
                  className="px-2 py-1 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 font-bold"
                >
                  ROOM204
                </button>
                <button
                  type="button"
                  onClick={() => setJoinCode("HITCSE")}
                  className="px-2 py-1 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 font-bold"
                >
                  HITCSE
                </button>
                <button
                  type="button"
                  onClick={() => setJoinCode("MESS204")}
                  className="px-2 py-1 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 font-bold"
                >
                  MESS204
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                Join Room Group
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
