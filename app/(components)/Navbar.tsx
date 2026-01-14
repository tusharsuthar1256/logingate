"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { status } = useSession();
  const pathname = usePathname();

  const isAuthenticated = status === "authenticated";

  const isHome = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isDocs = pathname.startsWith("/docs");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/">
          <div className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white cursor-pointer">
            MailVex.
          </div>
        </Link>

        {/* CENTER NAV (DESKTOP) */}
        {!isDocs && (
          <div className="hidden md:flex items-center p-1.5 bg-gray-100/50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-full backdrop-blur-md absolute left-1/2 -translate-x-1/2 shadow-sm">

            {/* HOME ROUTE */}
            {isHome && (
              <>
                <Link href="#features" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Features
                </Link>
                <Link href="/docs" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Docs
                </Link>
                <Link href="#pricing" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Pricing
                </Link>
              </>
            )}

            {/* DASHBOARD ROUTE */}
            {isDashboard && isAuthenticated && (
              <>
                <Link href="/dashboard" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Dashboard
                </Link>
                <Link href="/checklist" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Checklist
                </Link>
                <Link href="/analytics" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Analytics
                </Link>
                <Link href="/docs" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Docs
                </Link>
                <Link href="/settings" className="px-4 py-2 rounded-full text-sm font-medium hover-style">
                  Settings
                </Link>
              </>
            )}
          </div>
        )}

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
            <Sun size={20} />
          </button>

          {!isAuthenticated ? (
            <Link href="/sign-in">
              <button className="px-6 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold shadow hover:scale-105 transition">
                Get Started
              </button>
            </Link>
          ) : (
            <Link href="/dashboard">
              <button className="px-6 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold shadow hover:scale-105 transition">
                Dashboard
              </button>
            </Link>
          )}
        </div>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
            <Moon size={20} />
          </button>
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && !isDocs && (
        <div className="md:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 shadow-md">
          <div className="flex flex-col p-5 gap-3">

            {isHome && (
              <>
                <Link href="#features" className="mobile-link">Features</Link>
                <Link href="/docs" className="mobile-link">Docs</Link>
                <Link href="#pricing" className="mobile-link">Pricing</Link>
              </>
            )}

            {isDashboard && isAuthenticated && (
              <>
                <Link href="/dashboard" className="mobile-link">Analysis</Link>
                <Link href="/dashboard/checklist" className="mobile-link">Checklist</Link>
                <Link href="/dashboard/settings" className="mobile-link">Settings</Link>
              </>
            )}

            {!isAuthenticated && (
              <Link href="/sign-in">
                <button className="mt-3 w-full py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
