import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientShell from "@/components/ClientShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HostelPayAI - Smart Hostel Expense Management",
  description:
    "AI-powered hostel expense management for students. Split shared expenses, track pending dues, manage roommate balances, and view spending insights.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <AppProvider>
          <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading HostelPayAI...</div>}>
            <ClientShell>{children}</ClientShell>
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
