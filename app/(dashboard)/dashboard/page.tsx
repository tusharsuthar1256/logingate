'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Activity, ShieldCheck, Clock, CheckCircle, 
  FileText, Settings, Copy, Key, Bell, Search, Filter, 
  Plus, Trash2, ArrowRightLeft, X, ShieldAlert, MoreHorizontal,
  ChevronRight, ArrowRight, Book, Code, Info, AlertTriangle, ExternalLink
} from 'lucide-react';
import Navbar from '../../(components)/Navbar'

interface DashboardProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigateHome: () => void;
  initialTab?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode, toggleTheme, onNavigateHome, initialTab = 'analysis' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0B] pb-20 transition-colors duration-300">
      <Navbar/>
      
      <div className="pt-28 px-6 max-w-7xl mx-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'analysis' && <AnalysisView />}
          {activeTab === 'checklist' && <ChecklistView />}
          {activeTab === 'docs' && <DocsView />}
          {activeTab === 'settings' && <SettingsView />}
        </motion.div>
      </div>
    </div>
  );
};

// --- ANALYSIS VIEW ---
const AnalysisView = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Overview</h1>
      <p className="text-gray-500 dark:text-gray-400">Real-time metrics for your API usage.</p>
    </div>

    {/* Stats Grid */}
    <div className="grid md:grid-cols-3 gap-6">
      <StatCard 
        title="Total Checks" 
        value="124,592" 
        change="+12.5%" 
        icon={Activity} 
        color="text-blue-500" 
      />
      <StatCard 
        title="Threats Blocked" 
        value="8,402" 
        change="+4.2%" 
        icon={ShieldCheck} 
        color="text-red-500" 
      />
      <StatCard 
        title="Avg. Latency" 
        value="142ms" 
        change="-12ms" 
        icon={Clock} 
        color="text-emerald-500" 
      />
    </div>

    {/* Main Chart Section */}
    <div className="grid lg:grid-cols-3 gap-6 mt-8">
      <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Request Volume</h3>
          <select className="bg-gray-100 dark:bg-white/10 border-none rounded-lg px-3 py-1 text-sm text-gray-900 dark:text-white outline-none cursor-pointer">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        
        {/* Mock Chart Visualization */}
        <div className="h-64 flex items-end justify-between gap-2 px-2">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
            <div key={i} className="w-full bg-gray-100 dark:bg-white/5 rounded-t-lg relative group">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.05 }}
                className="w-full absolute bottom-0 bg-primary/80 dark:bg-primary rounded-t-lg group-hover:bg-primary transition-colors"
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {height * 120} reqs
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-400 font-mono">
           <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Threat Distribution</h3>
        <div className="space-y-6">
          <DistributionItem label="Disposable Email" percent={65} color="bg-red-500" />
          <DistributionItem label="Bad VPN / Proxy" percent={20} color="bg-orange-500" />
          <DistributionItem label="Blacklisted Domain" percent={10} color="bg-yellow-500" />
          <DistributionItem label="Malicious IP" percent={5} color="bg-purple-500" />
        </div>
        
        <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-bold text-primary">Tip:</span> Enable strict mode in settings to block all unknown VPNs automatically.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// --- CHECKLIST / ACCESS CONTROL VIEW ---
interface AccessItem {
  id: string;
  identity: string;
  type: 'email' | 'ip' | 'domain';
  description: string;
  date: string;
  status: 'active' | 'inactive';
}

const ChecklistView = () => {
  const [listType, setListType] = useState<'whitelist' | 'blacklist'>('whitelist');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Data
  const [items, setItems] = useState<AccessItem[]>([
    { id: '1', identity: 'trusted-partner.com', type: 'domain', description: 'Partner API access', date: '2023-10-15', status: 'active' },
    { id: '2', identity: '192.168.1.50', type: 'ip', description: 'Internal Monitor', date: '2023-11-02', status: 'active' },
    { id: '3', identity: 'admin@corp.net', type: 'email', description: 'Superadmin account', date: '2023-12-01', status: 'inactive' },
  ]);

  const [blacklistItems, setBlacklistItems] = useState<AccessItem[]>([
    { id: '101', identity: 'spammer@bad.com', type: 'email', description: 'Repeated failed logins', date: '2024-01-10', status: 'active' },
    { id: '102', identity: '14.2.55.12', type: 'ip', description: 'DDoS attempt source', date: '2024-02-15', status: 'active' },
  ]);

  const activeItems = listType === 'whitelist' ? items : blacklistItems;
  const setActiveItems = listType === 'whitelist' ? setItems : setBlacklistItems;

  const handleStatusToggle = (id: string) => {
    setActiveItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
    ));
  };

  const handleDelete = (id: string) => {
    setActiveItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    // In a real app, you'd process the form data here
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[600px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Access Control Lists</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your custom Allow/Deny rules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-gray-900/10 dark:shadow-white/10"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex items-center">
          <button 
            onClick={() => setListType('whitelist')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              listType === 'whitelist' 
                ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck size={16} /> Whitelist
          </button>
          <button 
            onClick={() => setListType('blacklist')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              listType === 'blacklist' 
                ? 'bg-white dark:bg-white/10 text-red-600 dark:text-red-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert size={16} /> Blacklist
          </button>
        </div>
        
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search emails, IPs, or domains..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Identity</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {activeItems.length > 0 ? (
                activeItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white font-mono font-medium text-sm">{item.identity}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="uppercase text-[10px] border border-gray-200 dark:border-white/10 px-1 rounded">{item.type}</span>
                          {item.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.description}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        item.status === 'active' 
                          ? listType === 'whitelist' 
                            ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' 
                            : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'active' 
                            ? listType === 'whitelist' ? 'bg-green-500' : 'bg-red-500'
                            : 'bg-gray-400'
                        }`} />
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => handleStatusToggle(item.id)}
                           className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                           title="Toggle Status"
                         >
                           <ArrowRightLeft size={16} />
                         </button>
                         <button 
                           onClick={() => handleDelete(item.id)}
                           className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                           title="Remove Entry"
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-2">
                         <Filter size={20} className="opacity-50" />
                       </div>
                       <p>No entries found in {listType}.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#121214] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Rule</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddItem} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rule Type</label>
                   <div className="grid grid-cols-2 gap-3">
                     <button type="button" className={`py-2 rounded-xl text-sm font-medium border ${listType === 'whitelist' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-gray-200 dark:border-white/10 text-gray-500'}`} onClick={() => setListType('whitelist')}>
                       Whitelist
                     </button>
                     <button type="button" className={`py-2 rounded-xl text-sm font-medium border ${listType === 'blacklist' ? 'border-red-500 bg-red-500/10 text-red-600' : 'border-gray-200 dark:border-white/10 text-gray-500'}`} onClick={() => setListType('blacklist')}>
                       Blacklist
                     </button>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Identity</label>
                   <input 
                      type="text" 
                      placeholder="e.g. user@example.com or 192.168.1.1" 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                   <input 
                      type="text" 
                      placeholder="Why are you adding this?" 
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                   />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity"
                  >
                    Add Rule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- DOCS VIEW (Nextra Style) ---

const Callout = ({ type = 'info', children }: { type?: 'info' | 'warning', children?: React.ReactNode }) => (
  <div className={`my-6 p-4 rounded-lg flex gap-3 text-sm ${
    type === 'info' 
      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-500/20' 
      : 'bg-orange-50 dark:bg-orange-500/10 text-orange-900 dark:text-orange-100 border border-orange-100 dark:border-orange-500/20'
  }`}>
    <div className="flex-shrink-0 mt-0.5">
      {type === 'info' ? <Info size={16} /> : <AlertTriangle size={16} />}
    </div>
    <div>{children}</div>
  </div>
);

const CodeBlock = ({ children }: { children?: React.ReactNode }) => (
  <div className="my-6 rounded-xl bg-gray-100 dark:bg-[#161618] border border-gray-200 dark:border-white/5 p-4 overflow-x-auto font-mono text-sm text-gray-800 dark:text-gray-300">
    {children}
  </div>
);

const DocsView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col lg:flex-row min-h-[80vh] relative">
      {/* Left Sidebar (Sticky) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-white/10 mr-12 pr-6">
        <div className="sticky top-32">
          <div className="space-y-8">
            <div>
              <h5 className="font-bold text-gray-900 dark:text-white mb-3 text-sm tracking-wide">Getting Started</h5>
              <ul className="space-y-1">
                <li className="text-sm font-medium text-primary bg-primary/5 rounded-md px-3 py-2 cursor-pointer border-l-2 border-primary">Introduction</li>
                <li className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors border-l-2 border-transparent hover:border-gray-300">Authentication</li>
                <li className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors border-l-2 border-transparent hover:border-gray-300">Errors</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 dark:text-white mb-3 text-sm tracking-wide">Resources</h5>
              <ul className="space-y-1">
                <li className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors border-l-2 border-transparent hover:border-gray-300">Rate Limits</li>
                <li className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors border-l-2 border-transparent hover:border-gray-300">Client Libraries</li>
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pb-16">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
          <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">MailVex</span>
          <ChevronRight size={14} />
          <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">Getting Started</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-semibold">Introduction</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Introduction</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          MailVex provides a high-performance REST API for detecting disposable emails, fake signups, and high-risk IP addresses in real-time.
        </p>

        <Callout type="info">
          <strong>Note:</strong> You need an API key to access endpoints. You can generate one in your <span className="underline cursor-pointer">Dashboard Settings</span>.
        </Callout>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Quick Start</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Make a GET request to the <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-primary">/verify</code> endpoint with an email address.
        </p>

        <CodeBlock>
          <pre>{`curl "https://api.mailvex.com/v1/verify?email=test@example.com" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
        </CodeBlock>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Response Format</h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          The API returns a JSON object containing the risk analysis.
        </p>

        <CodeBlock>
          <pre className="text-gray-500">
{`{
  "success": `}<span className="text-blue-500">true</span>{`,
  "data": {
    "email": `}<span className="text-green-500">"test@example.com"</span>{`,
    "risk_score": `}<span className="text-orange-500">10</span>{`,
    "verdict": `}<span className="text-green-500">"allow"</span>{`
  }
}`}
          </pre>
        </CodeBlock>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex justify-between">
          <div></div> {/* Placeholder for previous */}
          <a href="#" className="group flex flex-col items-end gap-1 text-right">
            <span className="text-sm text-gray-500 font-medium">Next</span>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              Authentication <ArrowRight size={20} />
            </div>
          </a>
        </div>
        
        <div className="mt-12 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors cursor-pointer">
           <ExternalLink size={14} /> Edit this page on GitHub
        </div>
      </div>

      {/* Right Sidebar (TOC) */}
      <aside className="hidden xl:block w-64 flex-shrink-0 ml-12 border-l border-gray-200 dark:border-white/10 pl-6">
        <div className="sticky top-32">
          <h5 className="font-bold text-gray-900 dark:text-white mb-4 text-xs uppercase tracking-wider">On This Page</h5>
          <ul className="space-y-3 text-sm">
            <li className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Quick Start</li>
            <li className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Response Format</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

// --- SETTINGS VIEW ---
const SettingsView = () => (
  <div className="max-w-2xl mx-auto space-y-8">
     <div className="mb-8">
      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <p className="text-gray-500 dark:text-gray-400">Manage your account and API keys.</p>
    </div>

    {/* Profile Section */}
    <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <UserIcon /> Profile Information
      </h3>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input type="text" defaultValue="Alex" className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input type="text" defaultValue="Morgan" className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <input type="email" defaultValue="alex@company.com" className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>
    </div>

    {/* API Key Section */}
    <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Key size={20} className="text-primary" /> API Keys
      </h3>
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Production Key</p>
          <p className="font-mono text-gray-900 dark:text-white text-sm">mv_live_sk_****************4x92</p>
        </div>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500">
          <Copy size={18} />
        </button>
      </div>
      <div className="mt-4">
        <button className="text-sm text-primary font-medium hover:underline">
          + Generate new secret key
        </button>
      </div>
    </div>
  </div>
);

// Helper Components
const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:translate-y-[-2px] transition-transform">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-xl bg-gray-50 dark:bg-white/5 ${color} bg-opacity-10`}>
        <Icon size={22} className={color} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
  </div>
);

const DistributionItem = ({ label, percent, color }: any) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <span className="font-mono text-gray-500">{percent}%</span>
    </div>
    <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1 }}
        className={`h-full ${color}`} 
      />
    </div>
  </div>
);

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
)

export default Dashboard;
