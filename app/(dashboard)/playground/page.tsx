"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Play, Key, Terminal, Send, RefreshCw, ChevronDown, CheckCircle, XCircle, Code, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simple manual syntax highlighter component for the "Editor" feel
const CodeEditor = ({ code, language }: { code: string; language: string }) => {
    const lines = code.split('\n');

    // Simple custom highlighting logic
    const highlight = (text: string) => {
        if (!text) return text;

        // Strings
        let highlighted = text.replace(/(['"])(.*?)\1/g, '<span class="text-[#ce9178] font-medium">$1$2$1</span>');

        // Keywords
        const keywords = language === 'python'
            ? ['import', 'print', 'as', 'from', 'in', 'is', 'not']
            : ['const', 'await', 'async', 'return', 'let', 'var', 'if', 'else', 'console', 'log'];

        keywords.forEach(kw => {
            const reg = new RegExp(`\\b${kw}\\b`, 'g');
            highlighted = highlighted.replace(reg, `<span class="text-[#569cd6] font-bold">${kw}</span>`);
        });

        // Built-ins / Methods
        const methods = ['fetch', 'requests', 'post', 'json', 'stringify', 'headers', 'method', 'body', 'url', 'requests.post', 'JSON'];
        methods.forEach(fn => {
            const reg = new RegExp(`\\b${fn}\\b`, 'g');
            highlighted = highlighted.replace(reg, `<span class="text-[#dcdcaa]">${fn}</span>`);
        });

        // Shell specific
        if (language === 'shell') {
            highlighted = highlighted.replace(/\b(curl)\b/g, '<span class="text-[#569cd6] font-bold">$1</span>');
            highlighted = highlighted.replace(/(-X|-H|-d)/g, '<span class="text-[#9cdcfe]">$1</span>');
        }

        return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
    };

    return (
        <div className="flex bg-[#1e1e1e] font-mono text-[13px] leading-relaxed overflow-hidden">
            {/* Line Numbers */}
            <div className="bg-[#1e1e1e] px-4 py-6 border-r border-[#333] text-[#858585] text-right select-none min-w-[50px]">
                {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-x-auto py-6 px-4 custom-scrollbar">
                {lines.map((line, i) => (
                    <div key={i} className="min-h-[1.5em] whitespace-pre">
                        {highlight(line)}
                    </div>
                ))}
            </div>
        </div>
    );
};

const JavascriptLogo = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 2.5H21.5V21.5H2.5V2.5Z" fill="#F7DF1E" />
        <path d="M13.2923 15.5492C13.2923 16.7118 13.9114 17.5143 15.2638 17.5143C16.5369 17.5143 17.156 16.6375 17.156 15.5925C17.156 13.9452 15.1524 13.6231 15.1524 12.3969C15.1524 11.6414 15.685 11.1336 16.4899 11.1336C17.2082 11.1336 17.654 11.4557 18.0626 11.9573L19.462 10.372C18.8427 9.53597 17.8458 9 16.5023 9C14.4713 9 13.0693 10.2757 13.0693 12.2793C13.0693 14.1219 15.0657 14.382 15.0657 15.6544C15.0657 16.1498 14.7314 16.509 14.1122 16.5214C13.3195 16.509 12.8737 16.1126 12.4402 15.481L11 16.9921C11.6192 18.0201 12.4892 18.5774 13.2923 18.5774L13.2923 15.5492Z" fill="black" />
        <path d="M6.92097 15.7161C6.92097 16.4715 7.42875 16.9669 8.09754 16.9669C8.80348 16.9669 9.22457 16.4468 9.22457 15.2082V9.06812H11.231V15.2454C11.231 17.4748 10.0296 18.5894 8.1223 18.5894C6.67325 18.5894 5.57095 17.9082 4.90214 16.5583L6.92097 15.7161Z" fill="black" />
    </svg>
);

const PythonLogo = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9772 1.62534C8.61483 1.62534 5.92348 2.27649 5.92348 2.27649L5.80529 3.3297L5.59235 5.89771L6.75171 6.00287C8.16934 6.13431 10.2315 6.27838 10.5927 6.42358C10.9538 6.56877 11.2562 6.89745 11.2562 7.39126C11.2562 7.88506 11.2646 9.47119 11.2646 9.47119H7.13527L6.027 9.49753L5.04414 10.1549L3.58572 11.8384L3 13.5678C3 13.5678 3.12513 16.1451 3.51817 17.0658C3.91122 17.9865 4.79526 18.999 4.79526 18.999L6.50201 19.3409V17.0326C6.50201 17.0326 6.47648 14.8624 7.64415 13.7505C8.81182 12.6385 10.4614 12.5596 10.4614 12.5596H15.0115C15.0115 12.5596 16.0354 12.4413 16.9272 11.6653C17.8189 10.8893 17.9765 9.77382 17.9765 9.77382V5.15446C17.9765 5.15446 17.9348 3.65582 16.8929 2.76814C15.851 1.88046 14.3683 1.74864 14.3683 1.74864C14.3683 1.74864 13.2536 1.62534 11.9772 1.62534ZM8.83594 3.42171C9.28479 3.42171 9.64811 3.78502 9.64811 4.23387C9.64811 4.68271 9.28479 5.04602 8.83594 5.04602C8.3871 5.04602 8.02379 4.68271 8.02379 4.23387C8.02379 3.78502 8.3871 3.42171 8.83594 3.42171Z" fill="#3776AB" />
        <path d="M12.0224 22.374C15.3848 22.374 18.0761 21.7229 18.0761 21.7229L18.1943 20.6696L18.4072 18.1016L17.2479 17.9965C15.8302 17.865 13.7681 17.721 13.4069 17.5758C13.0457 17.4306 12.7434 17.1019 12.7434 16.6081C12.7434 16.1143 12.735 14.5282 12.735 14.5282H16.8643L17.9726 14.5018L18.9554 13.8444L20.4138 12.161L21 10.4315C21 10.4315 20.8749 7.8542 20.4818 6.93351C20.0888 6.01282 19.2047 5.00035 19.2047 5.00035L17.498 4.65839V6.96677C17.498 6.96677 17.5235 9.13701 16.3558 10.2489C15.1882 11.3608 13.5386 11.4397 13.5386 11.4397H8.98845C8.98845 11.4397 7.96459 11.5581 7.07284 12.334C6.18108 13.11 6.02347 14.2255 6.02347 14.2255V18.8449C6.02347 18.8449 6.06518 20.3435 7.10706 21.2312C8.14894 22.1189 9.63162 22.2507 9.63162 22.2507C9.63162 22.2507 10.7464 22.374 12.0224 22.374ZM15.1636 20.5776C14.7148 20.5776 14.3515 20.2143 14.3515 19.7654C14.3515 19.3166 14.7148 18.9533 15.1636 18.9533C15.6125 18.9533 15.9758 19.3166 15.9758 19.7654C15.9758 20.2143 15.6125 20.5776 15.1636 20.5776Z" fill="#FFD43B" />
    </svg>
);

const BashLogo = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#4EAA25" />
        <path d="M14 16H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 8L10 12L6 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function PlaygroundPage() {
    const { user, isLoaded } = useUser();
    const [keys, setKeys] = useState<any[]>([]);
    const [selectedKey, setSelectedKey] = useState("");
    const [testEmail, setTestEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"python" | "javascript" | "shell">("javascript");
    const [copied, setCopied] = useState(false);

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
                if (data.data.length > 0) {
                    setSelectedKey(data.data[0].key);
                }
            }
        } catch (error) {
            console.error("Failed to fetch keys", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleTestApi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKey || !testEmail) return;

        setLoading(true);
        setResponse(null);

        try {
            const res = await fetch("/api/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${selectedKey}`
                },
                body: JSON.stringify({ email: testEmail }),
            });
            const data = await res.json();
            setResponse({
                status: res.status,
                data: data
            });
        } catch (error: any) {
            setResponse({
                status: 500,
                data: { error: "Failed to connect to API", details: error.message }
            });
        } finally {
            setLoading(false);
        }
    };

    const codeTemplates = {
        javascript: `const verifyEmail = async () => {
  const response = await fetch('https://api.logingate.live/api/verify-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${selectedKey || 'YOUR_API_KEY'}'
    },
    body: JSON.stringify({
      email: '${testEmail || 'test@example.com'}'
    })
  });

  const data = await response.json();
  console.log(data);
};`,
        python: `import requests

url = "https://api.logingate.live/api/verify-email"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${selectedKey || 'YOUR_API_KEY'}"
}
data = {
    "email": "${testEmail || 'test@example.com'}"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`,
        shell: `curl -X POST https://api.logingate.live/api/verify-email \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer ${selectedKey || 'YOUR_API_KEY'}" \\
     -d '{"email": "${testEmail || 'test@example.com'}"}'`
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Play size={24} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">API Playground</h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Test your email verification API in real-time and get integration code snippets.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Request Configuration - Column 1 (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Send size={20} className="text-primary" /> Configuration
                        </h3>

                        <form onSubmit={handleTestApi} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Key size={14} /> API Key
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedKey}
                                        onChange={(e) => setSelectedKey(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                                        disabled={fetchLoading || keys.length === 0}
                                    >
                                        {fetchLoading ? (
                                            <option>Loading keys...</option>
                                        ) : keys.length === 0 ? (
                                            <option>No API keys found</option>
                                        ) : (
                                            keys.map((k) => (
                                                <option key={k._id} value={k.key}>
                                                    {k.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Test Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. hello@example.com"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedKey || !testEmail}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                            >
                                {loading ? <RefreshCw size={20} className="animate-spin" /> : <Play size={20} />}
                                {loading ? "Verifying..." : "Verify Email"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Code & Response - Column 2 (8/12) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Visual Code Editor Component */}
                    <div className="rounded-3xl bg-[#121214] border border-white/10 shadow-2xl overflow-hidden flex flex-col group">
                        {/* Editor Toolbar (Mac-style) */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1e1e1e]">
                            <div className="flex items-center gap-6">
                                {/* Window Dots */}
                                <div className="flex gap-1.5 mr-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setActiveTab("javascript")}
                                        className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold rounded-t-lg transition-all ${activeTab === "javascript" ? "bg-[#1e1e1e] text-[#569cd6] border-b-2 border-[#569cd6]" : "text-gray-500 hover:text-gray-300"}`}
                                    >
                                        <JavascriptLogo /> JS
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("python")}
                                        className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold rounded-t-lg transition-all ${activeTab === "python" ? "bg-[#1e1e1e] text-[#569cd6] border-b-2 border-[#569cd6]" : "text-gray-500 hover:text-gray-300"}`}
                                    >
                                        <PythonLogo /> Python
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("shell")}
                                        className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold rounded-t-lg transition-all ${activeTab === "shell" ? "bg-[#1e1e1e] text-[#569cd6] border-b-2 border-[#569cd6]" : "text-gray-500 hover:text-gray-300"}`}
                                    >
                                        <BashLogo /> Shell
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => copyToClipboard(codeTemplates[activeTab])}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold"
                            >
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? "Copied!" : "Copy Code"}
                            </button>
                        </div>

                        {/* Code Display Area */}
                        <CodeEditor
                            code={codeTemplates[activeTab]}
                            language={activeTab}
                        />
                    </div>

                    {/* Response Panel */}
                    <div className="flex flex-col p-6 rounded-3xl bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Terminal size={20} className="text-primary" /> API Response Output
                            </h3>
                            {response && (
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${response.status < 400 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    Status: {response.status}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 bg-gray-50 dark:bg-black/50 rounded-2xl border border-gray-200 dark:border-white/5 p-4 font-mono text-sm overflow-auto max-h-[400px] custom-scrollbar">
                            {!response && !loading && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-4 min-h-[200px]">
                                    <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-full">
                                        <Terminal size={32} />
                                    </div>
                                    <p>Live response logs will appear here...</p>
                                </div>
                            )}

                            {loading && (
                                <div className="space-y-3">
                                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/5 rounded animate-pulse"></div>
                                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/5 rounded animate-pulse"></div>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {response && (
                                    <motion.pre
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-gray-800 dark:text-[#9cdcfe] whitespace-pre-wrap"
                                    >
                                        {JSON.stringify(response.data, null, 2)}
                                    </motion.pre>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
