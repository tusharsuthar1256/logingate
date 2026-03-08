"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Copy, Key, Plus, Trash2, X, PlusCircle, RefreshCw, Activity, Webhook, Shield, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && user?.id) {
            fetchKeys();
        }
    }, [isLoaded, user]);

    const fetchKeys = async () => {
        try {
            const res = await fetch(`/api/keys/list/${user?.id}`);
            const data = await res.json();
            if (data.data) {
                setKeys(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch keys", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName || !user?.id) return;

        setCreating(true);
        setCreateError(null);

        try {
            const res = await fetch("/api/keys/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keyName: newKeyName, userId: user.id }),
            });
            const data = await res.json();

            if (res.ok) {
                setIsCreateModalOpen(false);
                setNewKeyName("");
                fetchKeys();
            } else {
                setCreateError(data.error || "Failed to create API key");
            }
        } catch (error) {
            console.error("Failed to create key", error);
            setCreateError("A connection error occurred.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!keyToDelete) return;

        try {
            const res = await fetch(`/api/keys/delete/${keyToDelete}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setIsDeleteModalOpen(false);
                setKeyToDelete(null);
                fetchKeys();
            }
        } catch (error) {
            console.error("Failed to delete key", error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account and API keys.</p>
            </div>

            {/* Profile Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    Profile Information
                </h3>
                <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                            <input
                                type="text"
                                value={user?.fullName || ""}
                                disabled
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={user?.primaryEmailAddress?.emailAddress || ""}
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* API Key Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Key size={20} className="text-primary" /> API Keys
                    </h3>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <PlusCircle size={16} /> Create New Key
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Loading keys...</p>
                ) : keys.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No API keys generated yet.</p>
                ) : (
                    <div className="space-y-4">
                        {keys.map((key) => (
                            <div key={key._id} className="p-4 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 flex items-center justify-between group">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{key.name}</p>
                                    <p className="font-mono text-gray-900 dark:text-white text-sm">{key.key}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(key.key)}
                                        className="p-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                                        title="Copy Key"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setKeyToDelete(key._id);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="p-2 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        title="Delete Key"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rate Limits & Usage Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity size={20} className="text-primary" /> Usage & Rate Limits
                    </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total API Requests (This Month)</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">12,450 / 	&infin;</span>
                        </div>
                        <div className="mt-2 text-xs font-semibold text-green-500 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Unlimited Usage Active
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Rate Limit</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">Unlimited</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">You are on the unrestricted plan. Enjoy limitless API calls!</p>
                    </div>
                </div>
            </div>

            {/* Webhooks Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Webhook size={20} className="text-primary" /> Webhooks
                    </h3>
                    <button
                        className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        <PlusCircle size={16} /> Add Endpoint
                    </button>
                </div>
                <div className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center mb-3">
                        <Webhook size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No webhooks configured</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">Receive real-time HTTP requests to your server when events occur in your Logingate application.</p>
                </div>
            </div>

            {/* Notifications & Security */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-primary" /> Security & Notifications
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 shadow-sm">
                                <Bell size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Security alerts</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Get notified of any unusual API account activity</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-[#121214] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create API Key</h3>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        placeholder="e.g. Production Key"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>

                                {createError && (
                                    <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                        {createError}
                                    </p>
                                )}

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {creating ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE MODAL */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
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
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Revoke API Key?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                Any application using this API key will immediately lose access. This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
