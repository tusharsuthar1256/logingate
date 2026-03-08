"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Copy, Key, Plus, Trash2, X, PlusCircle, RefreshCw, Webhook, Shield, Bell, ShieldAlert, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
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

    // Webhook Settings
    const [webhookUrl, setWebhookUrl] = useState("");
    const [webhookEnabled, setWebhookEnabled] = useState(false);
    const [webhookSecret, setWebhookSecret] = useState("");
    const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
    const [savingWebhook, setSavingWebhook] = useState(false);

    // Domain Blocklist
    const [customDomains, setCustomDomains] = useState<string[]>([]);
    const [newDomain, setNewDomain] = useState("");
    const [reportingDomain, setReportingDomain] = useState(false);

    useEffect(() => {
        if (isLoaded && user?.id) {
            fetchKeys();
            fetchSettings();
            fetchWebhookLogs();
            fetchCustomDomains();
        }
    }, [isLoaded, user]);

    const fetchCustomDomains = async () => {
        try {
            const res = await fetch("/api/user/domains");
            const json = await res.json();
            if (json.success) {
                setCustomDomains(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch custom domains", error);
        }
    };

    const handleAddDomain = async () => {
        if (!newDomain || !newDomain.includes(".")) return;
        setReportingDomain(true);
        try {
            const res = await fetch("/api/user/domains", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain: newDomain }),
            });
            if (res.ok) {
                setNewDomain("");
                fetchCustomDomains();
            }
        } catch (error) {
            console.error("Failed to add domain", error);
        } finally {
            setReportingDomain(false);
        }
    };

    const handleDeleteDomain = async (domain: string) => {
        try {
            const res = await fetch("/api/user/domains", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain }),
            });
            if (res.ok) {
                fetchCustomDomains();
            }
        } catch (error) {
            console.error("Failed to delete domain", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/user/settings");
            const json = await res.json();
            if (json.success) {
                setWebhookUrl(json.data.webhookUrl);
                setWebhookEnabled(json.data.webhookEnabled);
                setWebhookSecret(json.data.webhookSecret);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const fetchWebhookLogs = async () => {
        try {
            const res = await fetch("/api/user/webhooks/logs");
            const json = await res.json();
            if (json.success) {
                setWebhookLogs(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch webhook logs", error);
        }
    };

    const handleSaveWebhook = async () => {
        setSavingWebhook(true);
        try {
            const res = await fetch("/api/user/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ webhookUrl, webhookEnabled }),
            });
            if (res.ok) {
                alert("Webhook settings updated!");
                fetchSettings();
            }
        } catch (error) {
            console.error("Failed to save webhook", error);
        } finally {
            setSavingWebhook(false);
        }
    };

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

    const [activeSection, setActiveSection] = useState("profile");

    const sections = [
        { id: "profile", label: "Profile", icon: <Shield size={18} /> },
        { id: "api-keys", label: "API Keys", icon: <Key size={18} /> },
        { id: "webhooks", label: "Webhooks", icon: <Webhook size={18} /> },
        { id: "blocklist", label: "Custom Blocklist", icon: <ShieldAlert size={18} /> },
        { id: "security", label: "Security & Notifications", icon: <Bell size={18} /> },
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; // Account for Navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row min-h-[80vh] relative lg:gap-12 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 lg:px-6 mt-10">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-white/10 pr-6">
                    <div className="sticky top-32">
                        <h5 className="font-bold text-white mb-6 text-sm tracking-wide uppercase opacity-50">Settings</h5>
                        <ul className="space-y-1">
                            {sections.map((section) => (
                                <li
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`flex items-center gap-3 text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${activeSection === section.id
                                        ? "text-primary bg-primary/10 border-l-2 border-primary"
                                        : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-white/20"
                                        }`}
                                >
                                    <span className={`${activeSection === section.id ? "text-primary" : "text-gray-500 group-hover:text-gray-300"}`}>
                                        {section.icon}
                                    </span>
                                    {section.label}
                                </li>
                            ))}
                        </ul>

                        {/* Links Content Reference from Docs */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <h5 className="font-bold text-white mb-4 text-xs uppercase tracking-wider opacity-50">Resources</h5>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="https://docs.logingate.live" target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors hover:underline">
                                        <Key size={14} /> Documentation <ArrowRight size={14} className="ml-auto" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 space-y-12">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
                        <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                        <ChevronRight size={14} />
                        <span className="text-white font-semibold">Settings</span>
                    </div>

                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Settings</h1>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            Configure your account preferences, manage API integrations, and set up security alerts.
                        </p>
                    </div>

                    {/* Profile Section */}
                    <section id="profile" className="scroll-mt-32">
                        <div className="p-8 rounded-3xl bg-[#121214] border border-white/10 shadow-sm transition-all hover:border-white/20 group">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <Shield size={24} className="text-primary group-hover:scale-110 transition-transform" /> Profile Information
                            </h3>
                            <div className="grid gap-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={user?.fullName || ""}
                                            disabled
                                            className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/5 text-gray-300 focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={user?.primaryEmailAddress?.emailAddress || ""}
                                        disabled
                                        className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/5 text-gray-300 focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* API Key Section */}
                    <section id="api-keys" className="scroll-mt-32">
                        <div className="p-8 rounded-3xl bg-[#121214] border border-white/10 shadow-sm transition-all hover:border-white/20 group">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <Key size={24} className="text-primary group-hover:scale-110 transition-transform" /> API Keys
                                </h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-white/5"
                                >
                                    <PlusCircle size={18} /> Create New Key
                                </button>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    <div className="h-20 bg-white/5 animate-pulse rounded-2xl" />
                                    <div className="h-20 bg-white/5 animate-pulse rounded-2xl" />
                                </div>
                            ) : keys.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-gray-500">No API keys generated yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {keys.map((key) => (
                                        <div key={key._id} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group/key hover:border-white/10 transition-all">
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1.5">{key.name}</p>
                                                <p className="font-mono text-white text-sm break-all bg-white/5 px-2 py-1 rounded-md">{key.key}</p>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <button
                                                    onClick={() => copyToClipboard(key.key)}
                                                    className="flex-1 sm:flex-none p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
                                                    title="Copy Key"
                                                >
                                                    <Copy size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setKeyToDelete(key._id);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="flex-1 sm:flex-none p-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl transition-all"
                                                    title="Delete Key"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>



                    {/* Webhooks Section */}
                    <section id="webhooks" className="scroll-mt-32">
                        <div className="p-8 rounded-3xl bg-[#121214] border border-white/10 shadow-sm transition-all hover:border-white/20 group">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <Webhook size={24} className="text-primary group-hover:scale-110 transition-transform" /> Webhooks
                                </h3>
                                <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">{webhookEnabled ? "Active" : "Paused"}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={webhookEnabled}
                                            onChange={(e) => setWebhookEnabled(e.target.checked)}
                                        />
                                        <div className="w-10 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Endpoint URL</label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="url"
                                            placeholder="https://your-server.com/webhooks/mailvex"
                                            value={webhookUrl}
                                            onChange={(e) => setWebhookUrl(e.target.value)}
                                            className="flex-1 px-4 py-3.5 rounded-xl bg-black/40 border border-white/5 text-gray-300 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                                        />
                                        <button
                                            onClick={handleSaveWebhook}
                                            disabled={savingWebhook}
                                            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-xl font-bold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {savingWebhook ? "Saving..." : "Save Settings"}
                                        </button>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                        We&apos;ll send a <code className="text-primary font-bold">POST</code> request to this URL whenever a high-risk threat is detected.
                                    </p>
                                </div>

                                {webhookSecret && (
                                    <div className="p-6 rounded-2xl bg-black/30 border border-dotted border-white/10">
                                        <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-3">Signing Secret</label>
                                        <div className="flex items-center justify-between gap-4">
                                            <code className="text-sm text-primary font-mono break-all">{webhookSecret}</code>
                                            <button onClick={() => copyToClipboard(webhookSecret)} className="p-2 text-gray-500 hover:text-white transition-colors">
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Webhook Logs */}
                                <div className="pt-8 border-t border-white/5">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Recent Deliveries</h4>
                                    {webhookLogs.length === 0 ? (
                                        <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
                                            <p className="text-sm text-gray-600 font-medium">No webhook events recorded yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {webhookLogs.map((log) => (
                                                <div key={log._id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 text-xs font-mono group/log hover:border-white/10 transition-all cursor-default">
                                                    <div className="flex items-center gap-4 w-full sm:w-auto mb-2 sm:mb-0">
                                                        <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                        <span className="text-gray-400 group-hover/log:text-white transition-colors uppercase tracking-tight">{log.event}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-12">
                                                        <span className="text-gray-600">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                                        <span className={`px-2.5 py-1 rounded-md font-bold ${log.responseStatus >= 200 && log.responseStatus < 300 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                            {log.responseStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* Custom Domain Blocklist Section */}
                    <section id="blocklist" className="scroll-mt-32">
                        <div className="p-8 rounded-3xl bg-[#121214] border border-white/10 shadow-sm transition-all hover:border-white/20 group">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <ShieldAlert size={24} className="text-primary group-hover:scale-110 transition-transform" /> Custom Blocklist
                                </h3>
                                <p className="mt-2 text-sm text-gray-400">Add specific domains you want to explicitly block in addition to our global database.</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Add Disposable Domain</label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="text"
                                            placeholder="e.g. temporary-mail-provider.com"
                                            value={newDomain}
                                            onChange={(e) => setNewDomain(e.target.value)}
                                            className="flex-1 px-4 py-3.5 rounded-xl bg-black/40 border border-white/5 text-gray-300 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                                        />
                                        <button
                                            onClick={handleAddDomain}
                                            disabled={reportingDomain}
                                            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-xl font-bold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {reportingDomain ? "Adding..." : "Add Domain"}
                                        </button>
                                    </div>
                                </div>

                                {customDomains.length > 0 && (
                                    <div className="pt-8 border-t border-white/5">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Your Blocked Domains</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {customDomains.map((dom, idx) => (
                                                <span key={idx} className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-2 group/tag hover:bg-primary/20 transition-all">
                                                    {dom}
                                                    <button
                                                        onClick={() => handleDeleteDomain(dom)}
                                                        className="text-primary/50 hover:text-white transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Notifications & Security */}
                    <section id="security" className="scroll-mt-32 pb-32">
                        <div className="p-8 rounded-3xl bg-[#121214] border border-white/10 shadow-sm transition-all hover:border-white/20 group">
                            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                <Shield size={24} className="text-primary group-hover:scale-110 transition-transform" /> Security & Notifications
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-primary shadow-sm border border-white/5">
                                            <Bell size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Security Alerts</p>
                                            <p className="text-xs text-gray-500">Get notified of any unusual API account activity</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>
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
                            className="relative w-full max-w-md bg-[#121214] rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Create API Key</h3>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Key Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        placeholder="e.g. Production Key"
                                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-primary outline-none"
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
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 font-medium hover:bg-white/10 transition-colors"
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
                            className="relative w-full max-w-sm bg-[#121214] rounded-3xl shadow-2xl overflow-hidden border border-white/10 p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Revoke API Key?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                Any application using this API key will immediately lose access. This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-gray-300 font-medium hover:bg-white/10 transition-colors"
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
        </>
    );
}
