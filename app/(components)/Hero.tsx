'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface HeroProps {
  onStart?: () => void;
  demo:String;
}

const Hero: React.FC<HeroProps> = ({ onStart, demo }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[95vh] text-center">
      {/* Background Lighting/Atmosphere */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        {/* Top glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 dark:bg-primary/15 rounded-[100%] blur-[120px]" />
        
        {/* Bottom wave glow */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-linear-to-t from-primary/10 via-indigo-900/5 to-transparent blur-3xl opacity-60 dark:opacity-100" />
        
        {/* Mesh grid subtle overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-gray-300 mb-8 hover:bg-white/90 dark:hover:bg-white/10 transition-colors cursor-pointer group shadow-sm"
        >
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
          <span className="group-hover:text-primary transition-colors">v1.0 API is now live</span>
          <ArrowRight size={12} className="text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </motion.div>
        
        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group cursor-default text-5xl md:text-7xl lg:text-8xl font-display font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-8"
        >
          Catch Fake Emails <br />
          <span 
            className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-primary to-indigo-400 bg-size-[200%_auto] animate-gradient-slow group-hover:animate-gradient-fast transition-all duration-300 drop-shadow-sm"
            style={{ backgroundSize: '200% auto' }}
          >
            Before They Hit DB.
            <span className="absolute inset-0 bg-linear-to-r from-indigo-500 via-white to-indigo-500 opacity-0 group-hover:opacity-20 bg-clip-text bg-aize-[200%_auto] animate-gradient-fast blur-xl transition-opacity duration-300"></span>
          </span>
        </motion.h1>
        
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-slow {
            animation: gradient 8s ease infinite;
          }
          .animate-gradient-fast {
            animation: gradient 3s linear infinite;
          }
        `}</style>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed"
        >
          Stop fake signups, disposable addresses, and abusive users with a single, lightning-fast API endpoint.
        </motion.p>
        
        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold transition-all hover:scale-105 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            Start for Free
          </button>
          
          <a 
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
          >
            <PlayCircle size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
            See How it Works
          </a>
        </motion.div>
      </div>

      {/* Decorative glow at bottom of section for mesh feel */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>

      {/* Mouse Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 pointer-events-none"
      >
        <div className="w-[26px] h-[42px] border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ 
              y: [0, 8, 0],
              opacity: [1, 0, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="w-1 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
