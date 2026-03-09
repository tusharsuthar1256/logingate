'use client'
import React from 'react';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#0A0A0B]/50 relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            A single API to protect against <br />
            <span className="text-gray-500 dark:text-gray-400">every bad actor.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We maintain real-time databases of millions of disposable email providers, bad IPs, and high-risk domains.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                <feature.icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;