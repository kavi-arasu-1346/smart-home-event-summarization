
import React, { useState, useEffect } from 'react';
import Spatial3DView from './Spatial3DView';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Zap, Wind, ShieldCheck, Cpu, Layers, RefreshCw, Leaf, Tv, BrainCircuit, Lock, Layout, Maximize2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SceneCard = ({ id, title, icon, desc, color }) => {
    const [activating, setActivating] = useState(false);

    const triggerScene = async () => {
        setActivating(true);
        try {
            const resp = await fetch('/api/trigger_scene', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scene: id })
            });
            const data = await resp.json();
            console.log("Scene triggered:", data.message);
        } catch (err) {
            console.error("Failed to trigger scene", err);
        }
        setTimeout(() => setActivating(false), 2000);
    };

    const colorClasses = {
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/20",
        red: "text-red-400 bg-red-500/10 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/20"
    };

    return (
        <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerScene}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col gap-1 ${colorClasses[color]}`}
        >
            {activating && <motion.div layoutId="pulse" className="absolute inset-0 bg-white/10 animate-pulse" />}
            <div className="flex items-center justify-between mb-1">
                <div className="p-1.5 bg-white/5 rounded-lg">{icon}</div>
                {activating && <RefreshCw size={10} className="animate-spin opacity-50" />}
            </div>
            <p className="text-[11px] font-bold tracking-tight">{title}</p>
            <p className="text-[9px] opacity-60 leading-none">{desc}</p>
        </motion.button>
    );
};

const DashboardView = ({ isCompact = false, refreshTrigger = 0, onZoneSelect = () => {}, currentZone = 'Room1', currentDevice = null }) => {
    const [show3D, setShow3D] = useState(false);
    const [stats, setStats] = useState({
        totalDevices: 0,
        runningNow: 0,
        powerUsage: 12.2,
        avgTemp: 22.5
    });
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isReacting, setIsReacting] = useState(false);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await fetch('/get_live_events');
            const data = await res.json();
            if (Array.isArray(data)) {
                setDevices(data);
                const running = data.filter(d => d.status?.toLowerCase() === 'on').length;
                setStats({
                    totalDevices: data.length,
                    runningNow: running,
                    powerUsage: data.reduce((acc, d) => acc + (parseFloat(d.energy_consumption) || 0), 0).toFixed(1),
                    avgTemp: 22.5
                });
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 20000);
        return () => clearInterval(interval);
    }, []);

    // Reactive Trigger from Chat
    useEffect(() => {
        if (refreshTrigger > 0) {
            setIsReacting(true);
            fetchDevices();
            setTimeout(() => setIsReacting(false), 2000);
        }
    }, [refreshTrigger]);

    const powerData = [
        { name: '00:00', val: 4 }, { name: '06:00', val: 8 }, { name: '12:00', val: 18 }, 
        { name: '18:00', val: 12 }, { name: '23:59', val: 6 }
    ];

    const pieData = [
        { name: 'HVAC', val: 40, color: '#3b82f6' },
        { name: 'Lights', val: 30, color: '#f59e0b' },
        { name: 'Rest', val: 30, color: '#ec4899' }
    ];

    return (
        <motion.div 
            animate={isReacting ? { 
                backgroundColor: ['rgba(12, 14, 22, 1)', 'rgba(59, 130, 246, 0.05)', 'rgba(12, 14, 22, 1)'],
                transition: { duration: 1.5 }
            } : {}}
            className={`flex flex-col h-full gap-6 ${isCompact ? 'p-4' : 'p-8'}`}
        >
            <div className="flex items-center justify-between mb-2">
                <div>
                   <h2 className="text-xl font-black tracking-tight text-white">Spatial Dashboard</h2>
                   <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Real-time Node Telemetry</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/optimize" className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 group transition-all" title="Sustainability Intelligence">
                        <Leaf size={18} className="group-hover:scale-110 transition-transform" />
                    </Link>
                    <button onClick={fetchDevices} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <RefreshCw size={18} className={loading ? 'animate-spin text-blue-400' : 'text-slate-400'} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className={`grid gap-4 ${isCompact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
                <StatBox label="Active" value={stats.runningNow} icon={<Activity size={14} />} color="blue" />
                <StatBox label="Usage" value={`${stats.powerUsage}W`} icon={<Zap size={14} />} color="amber" />
                {!isCompact && (
                    <>
                        <StatBox label="Temp" value={`${stats.avgTemp}°C`} icon={<Wind size={14} />} color="cyan" />
                        <StatBox label="Status" value="99.9%" icon={<ShieldCheck size={14} />} color="emerald" />
                    </>
                )}
            </div>

            {/* Main Chart */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Performance Stream</p>
                <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={powerData}>
                            <defs>
                                <linearGradient id="streamGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip contentStyle={{ backgroundColor: '#0f111a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} />
                            <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="url(#streamGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Spatial Blueprint (Interactive Map) ⭐ NEW */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Spatial Blueprint</p>
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/spatial-twin"
                            className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-lg shadow-black/20"
                        >
                            <Maximize2 size={10} /> Fullscreen
                        </Link>
                        <button 
                            onClick={() => setShow3D(!show3D)}
                            className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[8px] font-black uppercase text-blue-400 hover:bg-blue-500/20 transition-all"
                        >
                            <Layout size={10} /> {show3D ? 'View 2D' : 'View 3D'}
                        </button>
                        <div className="flex gap-1 text-[8px] font-bold uppercase text-slate-600">
                            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div> Active</div>
                            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div> Idle</div>
                        </div>
                    </div>
                </div>
                
                {show3D ? (
                    <div className="h-44 w-full">
                        <Spatial3DView 
                            currentZone={currentZone} 
                            onZoneSelect={onZoneSelect} 
                            currentDevice={currentDevice}
                            stats={stats} 
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 grid-rows-3 gap-2 h-44">
                        {/* Zone 2: Bedroom */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onZoneSelect('Room2')}
                            className={`row-span-1 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center group ${stats.runningNow > 2 ? 'bg-emerald-500/10' : 'bg-slate-900/60'}`}
                        >
                            <span className="text-[9px] font-bold opacity-30 group-hover:opacity-100 transition-opacity">BEDROOM (Z2)</span>
                            {stats.runningNow > 2 && <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-emerald-500/10 blur-xl pointer-events-none" />}
                        </motion.button>
                        
                        {/* Zone 3: Office */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onZoneSelect('Room3')}
                            className={`row-span-1 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center group ${stats.runningNow > 4 ? 'bg-indigo-500/10' : 'bg-slate-900/60'}`}
                        >
                            <span className="text-[9px] font-bold opacity-30 group-hover:opacity-100 transition-opacity">OFFICE (Z3)</span>
                            {stats.runningNow > 4 && <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-indigo-500/10 blur-xl pointer-events-none" />}
                        </motion.button>

                        {/* Zone 1: Living Room */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onZoneSelect('Room1')}
                            className={`col-span-2 row-span-1 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center group ${stats.runningNow > 0 ? 'bg-blue-500/15 border-blue-500/30 shadow-[0_0_20px_-10px_rgba(59,130,246,0.5)]' : 'bg-slate-900/60'}`}
                        >
                            <span className="text-[10px] font-black tracking-widest group-hover:scale-110 transition-transform">LIVING HUB (Z1)</span>
                            {stats.runningNow > 0 && <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-blue-500/5 blur-2xl pointer-events-none" />}
                        </motion.button>

                        {/* Zone 4: Kitchen */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onZoneSelect('Kitchen')}
                            className={`col-span-1 row-span-1 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center group bg-slate-900/60`}
                        >
                            <span className="text-[9px] font-bold opacity-30 group-hover:opacity-100 transition-opacity">KITCHEN (Z4)</span>
                        </motion.button>

                        {/* Utility / Bathroom */}
                        <div className="col-span-1 row-span-1 rounded-xl border border-white/5 flex gap-1 p-1 bg-slate-900/60">
                            <div className="flex-1 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center"><span className="text-[7px] font-bold uppercase opacity-20">Bath</span></div>
                            <div className="flex-1 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center"><span className="text-[7px] font-bold uppercase opacity-20">Util</span></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Scene Matrix */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Atmospheric Protocols</p>
                <div className="grid grid-cols-2 gap-3">
                    <SceneCard 
                        id="movie_night"
                        title="Movie Night" 
                        icon={<Tv size={14} />} 
                        desc="Dim-Vis sequence"
                        color="indigo"
                    />
                    <SceneCard 
                        id="eco_leaving"
                        title="Eco-Leaving" 
                        icon={<ShieldCheck size={14} />} 
                        desc="Energy lock-down"
                        color="emerald"
                    />
                    <SceneCard 
                        id="deep_focus"
                        title="Deep Focus" 
                        icon={<BrainCircuit size={14} />} 
                        desc="Neural opt-zone"
                        color="purple"
                    />
                    <SceneCard 
                        id="security_shield"
                        title="Security Shield" 
                        icon={<Lock size={14} />} 
                        desc="Perimeter check"
                        color="red"
                    />
                </div>
            </div>

            {/* Device List */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 overflow-hidden flex-1 flex flex-col">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Active Inventory</p>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                    {devices.map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/20 transition-all">
                            <div className="flex items-center gap-3">
                                <Cpu size={14} className={d.status?.toLowerCase() === 'on' ? 'text-blue-400' : 'text-slate-600'} />
                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight truncate w-24">{d.device_type?.replace('_',' ')}</span>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full ${d.status?.toLowerCase() === 'on' ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,1)]' : 'bg-slate-700'}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const StatBox = ({ label, value, icon, color }) => (
    <div className="bg-slate-900/60 border border-white/5 p-3 rounded-2xl">
        <div className="flex items-center gap-2 mb-1 opacity-60">
            <span className={`text-${color}-500`}>{icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-sm font-black text-white">{value}</div>
    </div>
);

export default DashboardView;
