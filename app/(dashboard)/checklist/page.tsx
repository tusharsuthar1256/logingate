'use client'
import { Filter, Plus, Trash2, X, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface DomainItem {
  _id?: string;
  domain: string;
  createdAt?: string;
}

export default function ChecklistView() {
  const { user, isLoaded } = useUser();
  const [listType, setListType] = useState<'whitelist' | 'blacklist'>('whitelist');

  const [whitelist, setWhitelist] = useState<DomainItem[]>([]);
  const [blacklist, setBlacklist] = useState<DomainItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [addError, setAddError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<DomainItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchLists();
    }
  }, [isLoaded, user]);

  const fetchLists = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Assuming the backend endpoints accept GET with userId to retrieve the list
      const wlRes = await fetch(`/api/lists/whitelist?userId=${user.id}`);
      if (wlRes.ok) {
        const wlData = await wlRes.json();
        setWhitelist(wlData.data || wlData || []);
      }
      const blRes = await fetch(`/api/lists/blacklist?userId=${user.id}`);
      if (blRes.ok) {
        const blData = await blRes.json();
        setBlacklist(blData.data || blData || []);
      }
    } catch (error) {
      console.error("Error fetching lists", error);
    } finally {
      setLoading(false);
    }
  };

  const validateDomain = (domain: string) => {
    // Basic domain validation
    if (!domain) return false;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    if (!user?.id) return;

    let domainInput = newDomain.trim();
    if (!domainInput) {
      setAddError("Domain cannot be empty.");
      return;
    }

    // Extract domain if it's an email address
    if (domainInput.includes("@")) {
      domainInput = domainInput.split("@")[1];
    }

    if (!validateDomain(domainInput)) {
      setAddError("Invalid domain format. Example: example.com or user@example.com");
      return;
    }

    setIsAdding(true);
    const endpoint = listType === 'whitelist' ? "/api/lists/whitelist" : "/api/lists/blacklist";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput, userId: user.id })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewDomain("");
        fetchLists(); // Refresh list
      } else {
        const data = await res.json();
        setAddError(data.error || "Failed to add domain.");
      }
    } catch (error) {
      setAddError("Connection error.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteDomain = async () => {
    if (!user?.id || !domainToDelete) return;
    setIsDeleting(true);
    const endpoint = listType === 'whitelist' ? "/api/lists/whitelist" : "/api/lists/blacklist";

    try {
      // Depending on backend design, DELETE might need domain via body or query params. Using body here.
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // If DELETE with body isn't supported, we could append it to query URL
        body: JSON.stringify({ domain: domainToDelete.domain, userId: user.id })
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDomainToDelete(null);
        fetchLists(); // Refresh list
      } else {
        console.error("Failed to delete domain");
      }
    } catch (error) {
      console.error("Connection error while deleting", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeItems = listType === 'whitelist' ? whitelist : blacklist;

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Access Lists</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage Whitelist and Blacklist domains for your account.</p>
        </div>
        <button
          onClick={() => {
            setAddError("");
            setNewDomain("");
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-lg"
        >
          <Plus size={18} /> Add Domain
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-full sm:w-fit border border-gray-200 dark:border-white/10">
        <button
          onClick={() => setListType('whitelist')}
          className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${listType === 'whitelist' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Whitelist Domains
        </button>
        <button
          onClick={() => setListType('blacklist')}
          className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${listType === 'blacklist' ? 'bg-white dark:bg-white/10 text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Blacklist Domains
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading domains...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-4 font-semibold">Domain</th>
                  <th className="pb-4 font-semibold">Type</th>
                  <th className="pb-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50 dark:divide-white/5">
                {activeItems.map((item, idx) => (
                  <tr key={item._id || idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-4 font-mono font-bold text-gray-900 dark:text-gray-200">{typeof item === 'string' ? item : item.domain}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold border ${listType === 'whitelist' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border-indigo-200/50' : 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-200/50'}`}>
                        {listType}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => {
                          setDomainToDelete(typeof item === 'string' ? { domain: item } : item);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 inline-flex bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        title="Delete Domain"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && activeItems.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Filter size={32} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">No domains found</h3>
              <p className="text-sm text-gray-500">Add a new domain to this list to customize access control.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Domain Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isAdding && setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#121214] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
            >
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">Add to {listType}</h3>
                <button onClick={() => setIsAddModalOpen(false)} disabled={isAdding} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddDomain} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Domain</label>
                  <input
                    type="text"
                    required
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com or user@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none font-mono"
                  />
                </div>
                {addError && (
                  <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                    {addError}
                  </p>
                )}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isAdding}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAdding ? "Adding..." : "Add Domain"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && domainToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#121214] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you sure you want to remove this domain?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-mono font-bold bg-gray-50 dark:bg-white/5 py-2 rounded-lg break-all">
                {domainToDelete.domain}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDomain}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}