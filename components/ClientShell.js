"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Toast from "@/components/Toast";

export default function ClientShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center text-slate-100">
        {children}
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Deep Navy Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Sticky Top Bar */}
        <TopBar setMobileOpen={setMobileOpen} />

        {/* Scrollable Page Body */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Interactive Global Toast */}
      <Toast />
    </div>
  );
}
