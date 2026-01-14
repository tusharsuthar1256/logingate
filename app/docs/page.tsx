
import React from 'react';
import { 
  ChevronRight, ArrowRight, ExternalLink, Info, AlertTriangle, 
  Sun
} from 'lucide-react';
import Link from 'next/link';

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

const Docs = () => {
  return (
    
    <div className="flex flex-col lg:flex-row min-h-[80vh] relative mx-40 mt-20">
       <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href={"/"}>
        <div className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-gray-900 dark:text-white cursor-pointer">
          MailVex.
        </div>
        </Link>

     

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Button */}
          <button className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
            <Sun size={20} />
          </button>

          {/* CTA Button */}
          <Link href={"/"}>
           <button
                     
                     className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                   >
                     Website <ArrowRight size={16} />
                   </button>
          </Link>
        </div>
      </div>

       

    
    </nav>
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

export default Docs;
