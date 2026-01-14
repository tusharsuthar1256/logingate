"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Checklist", href: "/checklist" },
  { name: "Analytics", href: "/analytics" },
  { name: "Docs", href: "/docs" },
  { name: "Settings", href: "/settings" },
];

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">
          MailVex.
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE (PROFILE) */}
        <div className="hidden md:flex items-center gap-4">
          {/* {isAuthenticated && session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full border border-gray-200 dark:border-white/10 cursor-pointer"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/10" />
          )} */}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-semibold ${
                  pathname === link.href
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && session?.user?.image && (
              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {session.user.name}
                    </p>
                    <p className="text-gray-500">{session.user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
