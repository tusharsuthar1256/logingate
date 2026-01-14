'use client'
import { Filter, Plus } from "lucide-react";
import { useState } from "react";

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
  
  // Mock Data
  const [items, setItems] = useState<AccessItem[]>([
    { id: '1', identity: 'trusted-partner.com', type: 'domain', description: 'Partner API access', date: '2023-10-15', status: 'active' },
    { id: '2', identity: '192.168.1.50', type: 'ip', description: 'Internal Monitor', date: '2023-11-02', status: 'active' },
    { id: '3', identity: 'admin@mailvex.com', type: 'email', description: 'Internal Team', date: '2023-12-01', status: 'active' },
  ]);

  const [blacklistItems, setBlacklistItems] = useState<AccessItem[]>([
    { id: '101', identity: 'spammer@bad.com', type: 'email', description: 'Abusive patterns', date: '2024-01-10', status: 'active' },
    { id: '102', identity: '14.2.55.12', type: 'ip', description: 'Known attack vector', date: '2024-02-15', status: 'active' },
  ]);

  const activeItems = listType === 'whitelist' ? items : blacklistItems;

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Access Lists</h1>
          <p className="text-gray-500 dark:text-gray-400">Override global rules with custom allow/deny targets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg"
        >
          <Plus size={18} /> Add New Rule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-full sm:w-fit border border-gray-200 dark:border-white/10">
        <button 
          onClick={() => setListType('whitelist')}
          className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${listType === 'whitelist' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Whitelist
        </button>
        <button 
          onClick={() => setListType('blacklist')}
          className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${listType === 'blacklist' ? 'bg-white dark:bg-white/10 text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Blacklist
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="pb-4 font-semibold">Target</th>
                <th className="pb-4 font-semibold">Type</th>
                <th className="pb-4 font-semibold">Notes</th>
                <th className="pb-4 font-semibold">Date Added</th>
                <th className="pb-4 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50 dark:divide-white/5">
              {activeItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-4 font-mono font-bold text-gray-900 dark:text-gray-200">{item.identity}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{item.description}</td>
                  <td className="py-4 text-gray-400">{item.date}</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {activeItems.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Filter size={32} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">No items found</h3>
              <p className="text-sm text-gray-500">Add a new rule to override standard protection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistView