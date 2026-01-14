'use client'
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '../constants';

interface PricingProps {
  onSelectPlan?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-24 px-6 bg-gray-50 dark:bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Simple, predictable pricing.
          </h2>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
             <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</span>
             <button 
               onClick={() => setIsYearly(!isYearly)}
               className="relative w-14 h-8 bg-gray-200 dark:bg-gray-800 rounded-full transition-colors focus:outline-none"
             >
               <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
             </button>
             <span className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
               Yearly <span className="text-xs text-emerald-500 font-bold ml-1">SAVE 20%</span>
             </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <div 
              key={index}
              className={`p-8 rounded-3xl relative border transition-all duration-300 ${
                plan.recommended 
                  ? 'bg-white dark:bg-white/5 border-primary/50 shadow-xl shadow-primary/10' 
                  : 'bg-white dark:bg-transparent border-gray-200 dark:border-gray-800'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                  RECOMMENDED
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                 <span className="text-4xl font-bold text-gray-900 dark:text-white">
                   ${isYearly ? Math.floor(plan.priceMonthly * 0.8) : plan.priceMonthly}
                 </span>
                 <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
                Up to {plan.limit}
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={onSelectPlan}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.recommended 
                    ? 'bg-primary hover:bg-indigo-600 text-white' 
                    : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
                }`}
              >
                {plan.recommended ? 'Start Free Trial' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
