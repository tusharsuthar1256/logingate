'use client'
import React from 'react';
import { Shield, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6 transition-colors duration-300 text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 font-display font-bold text-xl mb-6 text-gray-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Shield size={18} fill="currentColor" />
            </div>
            LOGINGATE
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            The standard for email verification and fraud prevention. Built for developers, by developers.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-900 dark:text-white">Product</h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-900 dark:text-white">Resources</h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-gray-900 dark:text-white">Stay Updated</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Subscribe to our developer newsletter.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email"
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm w-full text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400"
            />
            <button className="bg-primary hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors whitespace-nowrap shadow-lg shadow-primary/20">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-500">
        <p>&copy; 2024 LOGINGATE Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;