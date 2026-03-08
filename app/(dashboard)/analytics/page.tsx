'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from "@clerk/nextjs";
import { Search, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ApiLogEntry {
  _id: string;
  endpoint: string;
  method: string;
  requestPayload: any;
  responsePayload: any;
  statusCode: number;
  durationMs: number;
  verdict: string;
  threatType: string;
  createdAt: string;
}

const AnalyticsView = () => {
  const { user, isLoaded } = useUser();
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeframe, setTimeframe] = useState('7 Days');
  const filters = ['Today', 'Yesterday', '7 Days', 'Month', 'All'];

  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchLogs();
    }
  }, [isLoaded, user, timeframe, search]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        userId: user?.id || "",
        timeline: timeframe
      });
      if (search) {
        queryParams.append("search", search);
      }

      const res = await fetch(`/api/logs?${queryParams.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLogs(json.data || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">API Action Logs</h1>
          <p className="text-gray-500 dark:text-gray-400">Detailed track trace of every email verification requested.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 pt-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white placeholder:text-gray-500"
          />
        </div>

        {/* Time Filters */}
        <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-[1.25rem] border border-gray-200 dark:border-white/10 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setTimeframe(f)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${timeframe === f
                ? 'bg-white dark:bg-white/10 text-primary shadow-lg shadow-primary/10'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center text-gray-500">Loading your logs...</div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
          {logs.length === 0 ? (
            <div className="py-20 text-center text-gray-400">No requests found matching your filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Latency</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verdict</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {logs.map((log) => {
                    const isExpanded = expandedId === log._id;
                    const logEmail = log.requestPayload?.email || "Unknown";
                    const formattedDate = new Date(log.createdAt).toLocaleString();
                    const isAllowed = ['allow', 'safe', 'pass', 'valid'].includes(log.verdict?.toLowerCase() || '');

                    return (
                      <React.Fragment key={log._id}>
                        <tr className={`group transition-colors ${isExpanded ? 'bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                          <td className="px-6 py-4">
                            <span className="text-gray-900 dark:text-white font-mono font-medium text-sm">{logEmail}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2"><Clock size={14} /> {formattedDate}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                            {log.durationMs}ms
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isAllowed
                              ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                              : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                              }`}>
                              {isAllowed ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                              {log.verdict ? log.verdict.toUpperCase() : 'UNKNOWN'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => toggleExpand(log._id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="p-0 border-b border-gray-100 dark:border-white/5">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#121214] border-x-4 border-l-primary border-r-transparent">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Detailed Response Payload</h4>
                                    <pre className="bg-gray-100 dark:bg-black/50 p-4 rounded-xl text-xs font-mono text-gray-800 dark:text-gray-300 overflow-x-auto border border-gray-200 dark:border-white/10">
                                      {JSON.stringify(log.responsePayload, null, 2)}
                                    </pre>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;