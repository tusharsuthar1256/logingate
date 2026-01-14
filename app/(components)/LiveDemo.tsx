'use client'
import React, { useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';

const LiveDemo: React.FC = () => {
  const [email, setEmail] = useState('test@tempmail.so');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCheck = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        success: true,
        data: {
          email: email,
          domain: email.split('@')[1],
          is_disposable: email.includes('temp') || email.includes('mailinator'),
          is_free_provider: false,
          risk_score: email.includes('temp') ? 95 : 10,
          verdict: email.includes('temp') ? "block" : "allow",
          checks: {
            dns_valid: true,
            mx_valid: true,
            spf_record: true
          }
        }
      });
      setLoading(false);
    }, 800);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="demo" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-gray-800 dark:text-gray-200 mb-6">
              Live Interactive Demo
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
              Try it — See a live <br/> API response.
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              Enter any email address to see how MailVex analyzes the domain, MX records, and historical data to return a risk score.
            </p>
            
            <div className="flex flex-col gap-4">
               <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                 <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Simple Integration</h4>
                 <p className="text-sm text-gray-500 font-mono">GET https://api.mailvex.com/v1/verify</p>
               </div>
               <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                 <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Ultra-low Latency</h4>
                 <p className="text-sm text-gray-500">Average response time {'<'} 150ms</p>
               </div>
            </div>
          </div>

          {/* Right Demo Card */}
          <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 relative bg-white dark:bg-[#121214]">
             {/* Input Area */}
             <div className="flex gap-2 mb-6">
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="flex-1 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                 placeholder="name@company.com"
               />
               <button 
                 onClick={handleCheck}
                 disabled={loading}
                 className="bg-primary hover:bg-indigo-600 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
               >
                 {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   "Check"
                 )}
               </button>
             </div>

             {/* Output Area */}
             <div className="relative bg-gray-900 rounded-xl p-5 overflow-hidden min-h-[300px] border border-gray-800">
               <div className="absolute top-0 left-0 w-full h-8 bg-gray-800 flex items-center px-4 border-b border-gray-700 justify-between">
                 <span className="text-xs text-gray-500 font-mono">Response Body</span>
                 <button onClick={copyToClipboard} className="text-gray-500 hover:text-white transition-colors">
                   {copied ? <Check size={14} /> : <Copy size={14} />}
                 </button>
               </div>
               
               <div className="mt-6 overflow-auto font-mono text-xs md:text-sm text-gray-300 leading-relaxed max-h-[250px] custom-scrollbar">
                 {result ? (
                   <pre className="animate-in fade-in duration-300">
{`{
  "success": `}<span className="text-blue-400">{String(result.success)}</span>{`,
  "data": {
    "email": `}<span className="text-amber-300">"{result.data.email}"</span>{`,
    "domain": `}<span className="text-amber-300">"{result.data.domain}"</span>{`,
    "is_disposable": `}<span className={result.data.is_disposable ? "text-red-400" : "text-blue-400"}>{String(result.data.is_disposable)}</span>{`,
    "risk_score": `}<span className={result.data.risk_score > 50 ? "text-red-400" : "text-emerald-400"}>{result.data.risk_score}</span>{`,
    "verdict": `}<span className={result.data.verdict === 'block' ? "text-red-400" : "text-emerald-400"}>"{result.data.verdict}"</span>{`,
    "checks": {
      "dns_valid": `}<span className="text-blue-400">true</span>{`,
      "mx_valid": `}<span className="text-blue-400">true</span>{`,
      "spf_record": `}<span className="text-blue-400">true</span>{`
    }
  }
}`}
                   </pre>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3 mt-12">
                      <Play size={32} className="opacity-20" />
                      <p>Run a check to see response</p>
                    </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;