
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Home, Activity, Zap, Cpu, MessageSquareText, ShieldCheck, 
    ArrowUpRight, ArrowDownRight, Battery, 
    Bell, RefreshCw, Layers, LayoutDashboard, ChevronRight,
    Search, Menu, BrainCircuit, Wind
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDevices: 0,
        runningNow: 0,
        powerUsage: 12.4, // kWh default mock
        avgTemp: 22.5,
        energyTrend: '+5.2%',
        powerTrend: '-2.1%'
    });

    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await fetch('/get_live_events');
            const data = await res.json();
            
            if (Array.isArray(data)) {
                setDevices(data);
                const running = data.filter(d => d.status?.toLowerCase() === 'on').length;
                setStats(prev => ({
                    ...prev,
                    totalDevices: data.length,
                    runningNow: running,
                    powerUsage: data.reduce((acc, d) => acc + (parseFloat(d.energy_consumption) || 0), 0).toFixed(1)
                }));
            }
            setLoading(false);
        } catch (err) {
            console.warn("Dashboard fetch failed, loading mock devices:", err);
            const mockDevices = [
                { device_id: 101, device_type: 'tv', device_location: 'Room1', status: 'on', energy_consumption: 1.2, minutes_used: 45, playback: 'Netflix' },
                { device_id: 102, device_type: 'fan', device_location: 'Room1', status: 'on', energy_consumption: 0.5, minutes_used: 120, speed: 3 },
                { device_id: 103, device_type: 'light', device_location: 'Room1', status: 'on', energy_consumption: 0.1, minutes_used: 300 },
                { device_id: 201, device_type: 'washing_machine', device_location: 'Room2', status: 'off', energy_consumption: 0.0, minutes_used: 0, mode: 'Quick Wash' },
                { device_id: 202, device_type: 'fan', device_location: 'Room2', status: 'on', energy_consumption: 0.3, minutes_used: 60, speed: 2 },
                { device_id: 203, device_type: 'light', device_location: 'Room2', status: 'off', energy_consumption: 0.0, minutes_used: 0 },
                { device_id: 301, device_type: 'ac', device_location: 'Room3', status: 'on', energy_consumption: 2.5, minutes_used: 240, temperature: 22 },
                { device_id: 302, device_type: 'fan', device_location: 'Room3', status: 'off', energy_consumption: 0.0, minutes_used: 0, speed: 0 },
                { device_id: 303, device_type: 'light', device_location: 'Room3', status: 'on', energy_consumption: 0.1, minutes_used: 180 },
                { device_id: 401, device_type: 'oven', device_location: 'Kitchen', status: 'on', energy_consumption: 1.5, minutes_used: 45, mode: 'Bake' },
                { device_id: 402, device_type: 'light', device_location: 'Kitchen', status: 'on', energy_consumption: 0.1, minutes_used: 120 },
                { device_id: 501, device_type: 'light', device_location: 'Bathroom', status: 'off', energy_consumption: 0.0, minutes_used: 0 },
                { device_id: 502, device_type: 'light', device_location: 'Toilet', status: 'off', energy_consumption: 0.0, minutes_used: 0 }
            ];
            setDevices(mockDevices);
            const running = mockDevices.filter(d => d.status?.toLowerCase() === 'on').length;
            setStats({
                totalDevices: mockDevices.length,
                runningNow: running,
                powerUsage: mockDevices.reduce((acc, d) => acc + (parseFloat(d.energy_consumption) || 0), 0).toFixed(1),
                avgTemp: 22.5,
                energyTrend: '+5.2%',
                powerTrend: '-2.1%'
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 15000);
        return () => clearInterval(interval);
    }, []);

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
        <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-[#0f111a]/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Cpu size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">CORTEX HUB</span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
                        <Link to="/chat" className="hover:text-white transition-colors flex items-center gap-2">
                             <MessageSquareText size={16} /> AI Analyzer
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={fetchDevices} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff" alt="User" />
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-black mb-2">Spatial Analytics</h1>
                    <p className="text-slate-500 text-sm italic">Aggregate status reports from all spatial nodes.</p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <Card title="Active Nodes" value={stats.runningNow} icon={<Activity className="text-blue-500" />} subtitle={`Total: ${stats.totalDevices}`} />
                    <Card title="Consumption" value={`${stats.powerUsage}W`} icon={<Zap className="text-amber-500" />} subtitle="Real-time draw" />
                    <Card title="Equilibrium" value={`${stats.avgTemp}°C`} icon={<Wind className="text-cyan-400" />} subtitle="Spatial average" />
                    <Card title="Stability" value="99.9%" icon={<ShieldCheck className="text-emerald-500" />} subtitle="Node latency low" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Chart */}
                    <div className="lg:col-span-2 bg-[#111420] border border-white/5 rounded-[24px] p-8 shadow-2xl">
                        <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <Activity size={18} className="text-blue-500" /> Infrastructure Performance
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={powerData}>
                                    <defs>
                                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f111a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Chart */}
                    <div className="bg-[#111420] border border-white/5 rounded-[24px] p-8 shadow-2xl flex flex-col items-center">
                        <h3 className="text-lg font-bold mb-8 w-full">Energy Distro</h3>
                        <div className="h-[220px] w-full relative group">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="val">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f111a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-black">74%</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Load</span>
                            </div>
                        </div>
                        <div className="w-full space-y-3 mt-4">
                            {pieData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between text-xs font-bold p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                        <span className="text-slate-400">{d.name}</span>
                                    </div>
                                    <span>{d.val}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Device Inventory */}
                    <div className="lg:col-span-3 bg-[#111420] border border-white/5 rounded-[24px] p-8 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold">Spatial Node Inventory</h3>
                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg flex items-center gap-2">
                                <Activity size={14} className="animate-pulse" /> Live Status
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                           {devices.map((device, idx) => (
                               <div key={idx} className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all group">
                                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${device.status?.toLowerCase() === 'on' ? 'bg-blue-600/10 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                                       <Cpu size={24} />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                       <h4 className="text-sm font-bold truncate group-hover:text-blue-300 transition-colors uppercase tracking-tight">{device.device_type?.replace('_', ' ')}</h4>
                                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{device.device_location || 'Global'}</p>
                                   </div>
                                   <div className={`w-2 h-2 rounded-full ${device.status?.toLowerCase() === 'on' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]' : 'bg-slate-700'}`}></div>
                               </div>
                           ))}
                           {devices.length === 0 && (
                               <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-500 gap-2 opacity-40">
                                   <Layers size={32} />
                                   <p className="text-sm font-bold">Scanning for nodes...</p>
                               </div>
                           )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const Card = ({ title, value, icon, subtitle }) => (
    <div className="bg-[#111420] border border-white/5 p-6 rounded-[24px] shadow-2xl hover:border-blue-500/20 transition-all hover:-translate-y-1">
        <div className="mb-4">{icon}</div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-white tracking-tight mb-1">{value}</p>
        <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
    </div>
);

export default Dashboard;
