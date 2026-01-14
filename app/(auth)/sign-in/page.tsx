'use client';

import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignIn() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: any) => {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative">

        {/* Back Button */}
        <Link href={"/"}>
        <button className="absolute top-6 left-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        </Link>

        {/* Heading */}
        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to continue to MailVex
          </p>
        </div>

        {/* Form */}
        <form onSubmit={login} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>

            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 border 
                border-gray-200 dark:border-white/10 rounded-xl text-gray-900 
                dark:text-white focus:outline-none focus:ring-2 
                focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>

            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 border 
                border-gray-200 dark:border-white/10 rounded-xl text-gray-900 
                dark:text-white focus:outline-none focus:ring-2 
                focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
              Remember me
            </label>

            <button type="button" className="text-primary hover:underline font-medium">
              Forgot password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white 
            dark:text-black font-bold text-base hover:scale-[1.02] 
            active:scale-[0.98] transition-all shadow-lg 
            shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#121214] text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-3 rounded-xl bg-white dark:bg-white/5 border 
          border-gray-200 dark:border-white/10 text-gray-700 dark:text-white 
          font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors 
          flex items-center justify-center gap-2"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>

          Sign in with Google
        </button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary font-bold hover:underline">
            Sign up
          </Link>
        </div>

      </div>
    </section>
  );
}
