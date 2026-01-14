'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

export default function SignUp() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account created successfully!");
      router.push("/sign-in");
    } else {
      alert(data.error || "Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative">

        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-8 left-8 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Heading */}
        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Get Started
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Create your free MailVex account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name
            </label>

            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 
                border border-gray-200 dark:border-white/10 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-primary/50 
                text-gray-900 dark:text-white transition-shadow"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>

            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 
                border border-gray-200 dark:border-white/10 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-primary/50 
                text-gray-900 dark:text-white transition-shadow"
                placeholder="name@company.com"
                required
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 
                border border-gray-200 dark:border-white/10 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-primary/50 
                text-gray-900 dark:text-white transition-shadow"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gray-900 dark:bg-white 
            text-white dark:text-black font-bold text-base hover:scale-[1.02] 
            active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 
            flex items-center justify-center gap-2 disabled:opacity-70 
            disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight size={18} /></>
            )}
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

        {/* Google Sign Up */}
        <button 
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-3 rounded-xl bg-white dark:bg-white/5 
          border border-gray-200 dark:border-white/10 text-gray-700 
          dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/10 
          transition-colors flex items-center justify-center gap-2"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>

          Sign up with Google
        </button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button 
            onClick={() => router.push("/sign-in")}
            className="text-primary font-bold hover:underline"
          >
            Login
          </button>
        </div>

      </div>
    </section>
  );
}
