
import React, { useMemo } from 'react';
import { Activity, Zap, Cpu, Thermometer, Droplets, Clock, Gauge, Database, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Gauge Component (Trust Score) ---
export const TrustScoreGauge = ({ score, confidence, source }) => {
    // Determine color based on Provenance Score (0.0 - 1.0)
    let color = "#ef4444"; // Red (Low)
    let label = "Low Trust";

    if (score >= 0.8) {
        color = "#10b981"; // Emerald (High)
        label = "High Trust";
    } else if (score >= 0.5) {
        color = "#f59e0b"; // Amber (Medium)
        label = "Medium Trust";
    }

    const percentage = Math.round(score * 100);
    const confPercentage = Math.round((confidence || 0) * 100);

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm mb-6 shadow-lg">
            {/* Circular Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="32" cy="32" r="28"
                        stroke="#1e293b" strokeWidth="6" fill="transparent"
                    />
                    <circle
                        cx="32" cy="32" r="28"
                        stroke={color} strokeWidth="6" fill="transparent"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 - (175.9 * score)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-white">{percentage}%</span>
                </div>
            </div>

            {/* Labels */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Trust Analysis</h4>
                    <span className="text-xs font-mono text-slate-500">{source}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 font-medium" style={{ color: color }}>
                        <CheckCircle2 size={12} />
                        {label}
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">Conf: {confPercentage}%</span>
                </div>
            </div>
        </div>
    );
};

// --- Hallucination Diff Component ---
export const HallucinationDiff = ({ original, final }) => {
    if (!original || original === final) return null;

    return (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 overflow-hidden">
            <div className="bg-red-500/10 px-4 py-2 flex items-center gap-2 border-b border-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider">
                <XCircle size={14} />
                <span>Hallucination Detected & Corrected</span>
            </div>
            <div className="p-4 text-xs md:text-sm space-y-3">
                <div className="opacity-60 line-through decoration-red-500/50 decoration-2 text-slate-400 font-mono bg-black/20 p-2 rounded">
                    "{original}"
                </div>
                <div className="flex justify-center text-slate-600">
                    <ArrowRight size={16} />
                </div>
                <div className="text-emerald-400 font-medium bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                    "{final}"
                </div>
            </div>
        </div>
    );
};



// --- Helper: Extract Labels ---
const getSmartLabel = (item) => {
    if (item.device_location && item.device_type) return `${item.device_type} ${item.device_location}`;
    if (item.device_type) return item.device_type;
    let label = item._label || 'Unknown';
    if (label.length > 20) return label.substring(0, 18) + '...';
    return label;
};


// --- Data Source Badge ---
export const DataSourceBadge = ({ source }) => {
    let style = "bg-slate-800 text-slate-400 border-slate-700";
    let Icon = Database;

    if (source?.includes('Live')) {
        style = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        Icon = Zap;
    } else if (source?.includes('Vector')) {
        style = "bg-purple-500/10 text-purple-400 border-purple-500/20";
        Icon = Cpu;
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${style}`}>
            <Icon size={10} />
            {source || 'Unknown Source'}
        </span>
    );
};


