"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, Show, UserButton } from "@clerk/nextjs";
import { Menu, X, Play } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isAuthenticated = !!isSignedIn;

  const isHome = pathname === "/";
  const dashboardRoutes = ["/dashboard", "/checklist", "/analytics", "/settings", "/docs"];
  const isDashboard = dashboardRoutes.some(route => pathname.startsWith(route));
  const isPlayground = pathname === "/playground";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 py-3 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/">
          <div className="font-bold text-xl sm:text-2xl text-white cursor-pointer tracking-tighter">
            LOGINGATE
          </div>
        </Link>

        {/* CENTER NAV (DESKTOP) */}
        <div className="hidden md:flex items-center p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md absolute left-1/2 -translate-x-1/2 shadow-sm">

          {/* HOME ROUTE */}
          {isHome && (
            <>
              <Link href="#features" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Features
              </Link>
              <Link href="https://docs.logingate.live" target="_blank" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Docs
              </Link>
              <Link href="#pricing" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Pricing
              </Link>
            </>
          )}

          {/* DASHBOARD ROUTE */}
          {isDashboard && isAuthenticated && (
            <>
              <Link href="/dashboard" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Dashboard
              </Link>
              <Link href="/checklist" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Checklist
              </Link>
              <Link href="/analytics" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Analytics
              </Link>
              <Link href="/settings" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Settings
              </Link>
              <Link href="https://docs.logingate.live" target="_blank" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                Docs
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          {!isPlayground && (
            <Show when="signed-in">
              <Link href="/playground">
                <button className="p-2.5 rounded-full hover:bg-white/10 text-gray-300 flex items-center justify-center transition-colors" title="Playground">
                  <Play size={20} />
                </button>
              </Link>
            </Show>
          )}

          <Show when="signed-out">
            <Link href="/signup">
              <button className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold shadow hover:scale-105 transition">
                Get Started
              </button>
            </Link>
          </Show>
          <Show when="signed-in">
            {isPlayground ? (
              <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium mr-2 flex items-center gap-1 transition-colors">
                Website <span className="text-lg leading-none -mt-0.5">&rarr;</span>
              </Link>
            ) : (
              <Link href="/dashboard">
                <button className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold shadow hover:scale-105 transition mr-2">
                  Dashboard
                </button>
              </Link>
            )}
            <UserButton />
          </Show>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex items-center gap-3">
          {!isPlayground && (
            <Show when="signed-in">
              <Link href="/playground" className="p-2 rounded-full hover:bg-white/10 text-gray-300 text-sm transition-colors">
                <Play size={20} />
              </Link>
            </Show>
          )}
          <Show when="signed-in">
            {isPlayground && (
              <Link href="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
                Website <span className="text-lg leading-none -mt-0.5">&rarr;</span>
              </Link>
            )}
            <UserButton />
          </Show>
          <button onClick={() => setOpen(!open)} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black border-b border-white/10 shadow-md">
          <div className="flex flex-col p-5 gap-3">

            {isHome && (
              <>
                <Link href="#features" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Features</Link>
                <Link href="https://docs.logingate.live" target="_blank" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Docs</Link>
                <Link href="#pricing" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Pricing</Link>
              </>
            )}

            {isDashboard && isAuthenticated && (
              <>
                <Link href="/dashboard" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Dashboard</Link>
                <Link href="/checklist" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Checklist</Link>
                <Link href="/analytics" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Analytics</Link>
                <Link href="https://docs.logingate.live" target="_blank" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Docs</Link>
                <Link href="/settings" className="p-3 rounded-xl hover:bg-white/5 transition-colors">Settings</Link>
              </>
            )}

            <Show when="signed-out">
              <Link href="/signup">
                <button className="mt-3 w-full py-4 rounded-xl bg-white text-black font-semibold">
                  Get Started
                </button>
              </Link>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
}
