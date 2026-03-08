'use client'
import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';

export interface DataPoint {
    label: string;
    value: number;
    timestamp: string;
}

export const InteractiveChart = ({
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

    const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 10) * 1.1, [data]);
    const width = 1000;
    const h = 300;

    const points = useMemo(() => {
        return data.map((d, i) => ({
            x: (i / (data.length > 1 ? data.length - 1 : 1)) * width,
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
        if (!containerRef.current || data.length === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        const index = Math.round(percent * (data.length - 1));
        setHoveredIndex(Math.max(0, Math.min(data.length - 1, index)));
    };

    if (data.length === 0) {
        return <div className="w-full flex items-center justify-center text-gray-500" style={{ height }}>No data available</div>;
    }

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

                {[0, 0.25, 0.5, 0.75, 1].map(v => (
                    <line
                        key={v}
                        x1="0" y1={v * h} x2={width} y2={v * h}
                        stroke="currentColor"
                        className="text-gray-100 dark:text-white/5"
                        strokeWidth="1"
                    />
                ))}

                {showArea && (
                    <motion.path
                        d={areaD}
                        fill={`url(#grad-${color})`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                )}

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

            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-mono text-gray-400 uppercase tracking-widest px-2">
                {data.filter((_, i) => i % Math.max(1, Math.ceil(data.length / 6)) === 0).map((d, i) => (
                    <span key={i}>{d.label}</span>
                ))}
            </div>
        </div>
    );
};
