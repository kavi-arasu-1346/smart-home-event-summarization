
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    ChevronLeft, Maximize2, Zap, Layout, 
    MousePointer2, Eye, Box, MousePointer, 
    Lightbulb, Fan, Home, Search
} from 'lucide-react';
import Spatial3DView from '../components/Spatial3DView';

const SpatialDigitalTwin = () => {
    const [focusTarget, setFocusTarget] = useState({ zone: null, device: null });
    const [stats, setStats] = useState({ runningNow: 0 });

    const targetingProtocols = [
        { id: 'room1', name: 'Living Room (Z1)', icon: <Home size={16} />, type: 'zone' },
        { id: 'room2', name: 'Master Bed (Z2)', icon: <Layout size={16} />, type: 'zone' },
        { id: 'room3', name: 'Office Hub (Z3)', icon: <Box size={16} />, type: 'zone' },
        { id: 'room4', name: 'Kitchen (Z4)', icon: <Zap size={16} />, type: 'zone' },
        { id: 'room5', name: 'Terrace Hub (Z5)', icon: <Layout size={16} />, type: 'zone' },
        { id: 'light', name: 'Smart Array', icon: <Lightbulb size={16} />, type: 'device' },
        { id: 'fan', name: 'Climate Rotor', icon: <Fan size={16} />, type: 'device' }
    ];

    const handleTargetSet = (item) => {
        if (item.type === 'zone') {
            setFocusTarget({ zone: item.id, device: null });
        } else {
            setFocusTarget({ zone: null, device: { id: item.id } });
        }
    };

    return (
        <div className="h-screen w-screen bg-[#07080e] overflow-hidden flex flex-col font-sans selection:bg-blue-500/30">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none">
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="pointer-events-auto"
                >
                    <Link to="/chat" className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all group shadow-2xl">
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Return to Hub</span>
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                >
                    <h1 className="text-[12px] font-black text-white uppercase tracking-[0.4em] drop-shadow-lg">Spatial Intelligence Digital Twin</h1>
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Precision Targeting Engaged
                    </div>
                </motion.div>

                <div className="flex items-center gap-3 pointer-events-auto">
                     <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-2xl">
                        V-4.0 Stable
                     </div>
                </div>
            </div>

            {/* Sidebar Controls */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-none w-64">
                <motion.div 
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-[#0c0e16]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] pointer-events-auto shadow-2xl"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Search size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Navigation</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {targetingProtocols.map((item) => (
                            <motion.button
                                key={item.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTargetSet(item)}
                                className={`w-full p-3 flex items-center justify-between rounded-xl transition-all border ${
                                    (focusTarget.zone === item.id || focusTarget.device?.id === item.id)
                                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                                    : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`${(focusTarget.zone === item.id || focusTarget.device?.id === item.id) ? 'text-white' : 'text-blue-500'}`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider">{item.name}</span>
                                </div>
                                <MousePointer2 size={12} className="opacity-30" />
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Orbit Lock</span>
                            <div className="w-8 h-4 bg-emerald-500/20 rounded-full flex items-center justify-end px-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /></div>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Auto Zoom</span>
                            <div className="w-8 h-4 bg-emerald-500/20 rounded-full flex items-center justify-end px-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/40 backdrop-blur-md px-6 py-3 border border-white/5 rounded-full flex items-center gap-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] pointer-events-none">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" /> Left-Click: Orbit</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" /> Right-Click: Pan</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" /> Scroll: Zoom</div>
            </div>

            {/* 3D Canvas Area */}
            <div className="flex-1 w-full bg-gradient-to-b from-[#07080e] to-[#0c0e16] relative">
                <AnimatePresence mode="wait">
                   <motion.div 
                     key="spatial-canvas"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0"
                   >
                     <Spatial3DView 
                        currentZone={focusTarget.zone} 
                        currentDevice={focusTarget.device}
                        stats={stats}
                     />
                   </motion.div>
                </AnimatePresence>

                {/* Floating Metrics */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center gap-2 w-20 shadow-2xl">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">FPS</span>
                        <span className="text-sm font-black text-emerald-400 font-mono tracking-tighter">60.2</span>
                    </div>
                     <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center gap-2 w-20 shadow-2xl">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Draw</span>
                        <span className="text-sm font-black text-blue-400 font-mono tracking-tighter">1.2ms</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpatialDigitalTwin;
