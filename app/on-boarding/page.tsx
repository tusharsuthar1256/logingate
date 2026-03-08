'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
  Send,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface OnboardingProps {
  onNavigateHome: () => void;
}

/* Floating Background Blob */
const FloatingBlob = ({
  color,
  size,
  initialPos,
  duration,
}: {
  color: string;
  size: string;
  initialPos: { top?: string; left?: string; right?: string; bottom?: string };
  duration: number;
}) => (
  <motion.div
    {...({
      animate: {
        x: [0, 40, -30, 0],
        y: [0, -30, 40, 0],
        scale: [1, 1.1, 0.95, 1],
      },
      transition: { duration, repeat: Infinity, ease: 'linear' },
    } as any)}
    className={`absolute rounded-full blur-[120px] opacity-40 dark:opacity-20 pointer-events-none ${color}`}
    style={{ width: size, height: size, ...initialPos }}
  />
);

const Onboarding: React.FC<OnboardingProps> = ({ onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / 25);
      mouseY.set(e.clientY / 25);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async () => {
    if (!email.includes('@')) return;

    try {
      setStatus('loading');

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };


  const socialLinks = [
    { icon: <Linkedin size={22} />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram size={22} />, href: '#', label: 'Instagram' },
    { icon: <Twitter size={22} />, href: '#', label: 'X' },
    { icon: <Mail size={22} />, href: 'mailto:hello@mailvex.com', label: 'Email' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50 dark:bg-[#0A0A0B]">

      {/* Animated Background */}
      <motion.div style={{ x: springX, y: springY } as any} className="absolute inset-0 -z-10">
        <FloatingBlob color="bg-indigo-500" size="420px" initialPos={{ top: '-10%', left: '5%' }} duration={22} />
        <FloatingBlob color="bg-cyan-500" size="380px" initialPos={{ bottom: '10%', right: '5%' }} duration={26} />
        <FloatingBlob color="bg-purple-600" size="320px" initialPos={{ top: '40%', left: '45%' }} duration={18} />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-3xl w-full text-center space-y-12 sm:space-y-16 z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest mx-auto">
          <Sparkles size={14} className="text-indigo-400" />
          Coming Soon
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
          Elevating <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-cyan-400 to-primary animate-gradient-slow">
            Email Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          LOGINGATE is refining its final layers. Secure your spot in our private beta.
        </p>

        {/* Email Box */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              {...({ initial: { opacity: 0 }, animate: { opacity: 1 } } as any)}
              className="flex flex-col items-center gap-4 p-6 sm:p-8 bg-white dark:bg-white/5 rounded-3xl border border-emerald-500/30 shadow-xl"
            >
              <CheckCircle2 size={40} className="text-emerald-500" />
              <p className="font-semibold text-gray-900 dark:text-white">
                You’re officially waitlisted!
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 bg-white/80 dark:bg-white/5 backdrop-blur-xl border rounded-3xl p-2 shadow-xl max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 bg-transparent outline-none text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSubmit}
                disabled={!email.includes('@') || status === 'loading'}
                className="px-6 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center gap-2 hover:scale-[1.03] transition"
              >
                {status === 'loading' ? '...' : 'Notify Me'}
                <Send size={18} />
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-20 flex flex-col items-center gap-6">
        <p className="text-[10px] tracking-[0.35em] text-gray-400 uppercase">
          Join our network
        </p>
        <div className="flex gap-4 sm:gap-6">
          {socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.href}
              className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border text-gray-500 hover:text-primary transition"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-slow {
          background-size: 200% auto;
          animation: gradient-move 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
