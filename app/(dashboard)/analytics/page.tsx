'use client'
// --- ANALYTICS VIEW ---

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ShieldAlert, TrendingDown, TrendingUp, Zap } from "lucide-react";


const InteractiveChart = ({ 
  data, 
  color = "#6C7BFF", 
  height = 280, 
  showArea = true,
  unit = ""
}: { 
  data: DataPoint[], 
  color?: string, 
  height?: number, 
  showArea?: boolean,
  unit?: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 100) * 1.1, [data]);
  const width = 1000;
  const h = 300;

  const points = useMemo(() => {
    return data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: h - (d.value / maxVal) * h,
    }));
  }, [data, maxVal]);

  const pathD = useMemo(() => {
    if (points.length < 2) return "";
    return `M ${points[0].x} ${points[0].y} ` + 
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }, [points]);

  const areaD = useMemo(() => {
    if (!pathD) return "";
    return `${pathD} L ${points[points.length - 1].x} ${h} L 0 ${h} Z`;
  }, [pathD, points]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const index = Math.round(percent * (data.length - 1));
    setHoveredIndex(Math.max(0, Math.min(data.length - 1, index)));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full" 
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <svg 
        viewBox={`0 0 ${width} ${h}`} 
        className="w-full h-full overflow-visible" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <line 
            key={v} 
            x1="0" y1={v * h} x2={width} y2={v * h} 
            stroke="currentColor" 
            className="text-gray-100 dark:text-white/5" 
            strokeWidth="1" 
          />
        ))}

        {/* Area */}
        {showArea && (
          <motion.path 
            d={areaD} 
            fill={`url(#grad-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* Path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Hover State UI */}
        {hoveredIndex !== null && (
          <g>
            <line 
              x1={points[hoveredIndex].x} 
              y1="0" 
              x2={points[hoveredIndex].x} 
              y2={h} 
              stroke={color} 
              strokeWidth="2" 
              strokeDasharray="4 4" 
              className="opacity-50"
            />
            <circle 
              cx={points[hoveredIndex].x} 
              cy={points[hoveredIndex].y} 
              r="8" 
              fill={color} 
              className="shadow-xl"
            />
            <circle 
              cx={points[hoveredIndex].x} 
              cy={points[hoveredIndex].y} 
              r="12" 
              fill={color} 
              className="opacity-20 animate-pulse"
            />
          </g>
        )}
      </svg>

      {/* Live Tooltip Overlay */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute z-30 pointer-events-none bg-gray-900/95 dark:bg-white/95 backdrop-blur-md text-white dark:text-gray-900 p-3 rounded-xl shadow-2xl border border-white/10 dark:border-black/10 min-w-[140px]"
            style={{
              left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
              top: `20%`,
              transform: `translateX(${hoveredIndex > data.length / 2 ? '-110%' : '10%'})`
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
              {data[hoveredIndex].timestamp}
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-black">{data[hoveredIndex].value.toLocaleString()}{unit}</span>
              <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: color }} />
            </div>
            <p className="text-[10px] font-medium opacity-60">{data[hoveredIndex].label}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Labels */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-mono text-gray-400 uppercase tracking-widest px-2">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

const AnalyticsView = () => {
  const [timeframe, setTimeframe] = useState('Week');
  const filters = ['Day', 'Week', 'Month', 'Year', 'All'];

  // Mock data generator - Replace this with your API call
  const generateData = (count: number, min: number, max: number, labels: string[]) => {
    return Array.from({ length: count }).map((_, i) => ({
      label: labels[i % labels.length],
      value: Math.floor(Math.random() * (max - min) + min),
      timestamp: `2024-05-${(i + 1).toString().padStart(2, '0')} 14:00`
    }));
  };

  const totalData = useMemo(() => {
    const labels = timeframe === 'Week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : 
                   timeframe === 'Month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                   ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return generateData(labels.length, 10000, 50000, labels);
  }, [timeframe]);

  const safeData = useMemo(() => generateData(totalData.length, 8000, 45000, totalData.map(d => d.label)), [totalData]);
  const fakeData = useMemo(() => generateData(totalData.length, 500, 5000, totalData.map(d => d.label)), [totalData]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 mt-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">Detailed Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Advanced visualization of your verification pipeline metrics.</p>
        </div>
        
        {/* Time Filters */}
        <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-[1.25rem] border border-gray-200 dark:border-white/10 self-start md:self-auto shadow-inner">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setTimeframe(f)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                timeframe === f 
                  ? 'bg-white dark:bg-white/10 text-primary shadow-lg shadow-primary/10' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Full Width Chart: Total Emails Verified */}
      <motion.div 
        layout
        className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden relative group"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Cumulative Verified</h3>
            <p className="text-sm text-gray-500">Total volume processed through the MailVex Gateway</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-primary tracking-tighter">
              {totalData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
            </p>
            <p className="text-xs text-emerald-500 font-bold flex items-center justify-end gap-1 mt-1">
              <TrendingUp size={14} /> +12.5% increase
            </p>
          </div>
        </div>

        <InteractiveChart data={totalData} color="#6C7BFF" height={320} />
      </motion.div>

      {/* 2. Side-by-Side Comparison */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Safe Zone (Blue) */}
        <motion.div 
          layout
          className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl group"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Safe Zone</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Verdicts: ALLOW</p>
              </div>
            </div>
          </div>
          
          <InteractiveChart data={safeData} color="#3B82F6" height={220} showArea={false} />
          
          <div className="mt-12 flex items-end justify-between">
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {safeData.reduce((a, b) => a + b.value, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 font-medium">Clean traffic successfully passed</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl">
               <TrendingUp size={16} /> 14.2%
            </div>
          </div>
        </motion.div>

        {/* Fake Zone (Red) */}
        <motion.div 
          layout
          className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl group"
        >
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 shadow-inner">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fake Zone</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Verdicts: BLOCK</p>
              </div>
            </div>
          </div>

          <InteractiveChart data={fakeData} color="#EF4444" height={220} showArea={false} />

          <div className="mt-12 flex items-end justify-between">
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {fakeData.reduce((a, b) => a + b.value, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 font-medium">Malicious threats intercepted</p>
            </div>
            <div className="flex items-center gap-1.5 text-red-500 text-sm font-bold bg-red-500/10 px-3 py-1.5 rounded-xl">
               <TrendingDown size={16} /> 3.1%
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

// --- STATS AND DISTRIBUTION HELPERS ---

// Fix: Added missing StatCard component
const StatCard = ({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string, icon: any, color: string }) => (
  <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm transition-all hover:border-primary/20">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-white/5 ${color}`}>
        <Icon size={24} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

// Fix: Added missing DistributionItem component
const DistributionItem = ({ label, percent, color }: { label: string, percent: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs font-bold">
      <span className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[10px]">{label}</span>
      <span className="text-gray-900 dark:text-white">{percent}%</span>
    </div>
    <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        {...({
          initial: { width: 0 },
          animate: { width: `${percent}%` },
          transition: { duration: 1, ease: "easeOut" }
        } as any)}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);

export default AnalyticsView