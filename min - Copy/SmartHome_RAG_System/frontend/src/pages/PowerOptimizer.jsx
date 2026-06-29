
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Zap, BrainCircuit, Leaf, ArrowRight, ShieldCheck, 
    Home, MessageSquareText, LayoutDashboard, Cpu,
    TrendingDown, Gauge, Clock, Sparkles
} from 'lucide-react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

const PowerOptimizer = () => {
    const [efficiencyScore, setEfficiencyScore] = useState(84);
    const [energySummary, setEnergySummary] = useState({
        projected_bill: 142.40,
        potential_savings: 18.92,
        daily_history: [
            { day: 'Mon', cost: 4.2 }, { day: 'Tue', cost: 3.8 }, { day: 'Wed', cost: 5.1 },
            { day: 'Thu', cost: 4.7 }, { day: 'Fri', cost: 6.2 }, { day: 'Sat', cost: 7.4 },
            { day: 'Sun', cost: 6.8 }
        ]
    });

    useEffect(() => {
        const fetchEnergyData = async () => {
            try {
                const resp = await fetch('/api/get_energy_summary');
                const data = await resp.json();
                if (data.projected_bill) setEnergySummary(data);
            } catch (err) {
                console.error("Energy fetch error", err);
            }
        };
        fetchEnergyData();
    }, []);

    const [suggestions, setSuggestions] = useState([
        { 
            id: 1, 
            title: "Thermal Calibration", 
            impact: "High", 
            savings: "2.4 kWh/day", 
            desc: "Zone 3 AC is operating at 18°C while Zone 2 is unoccupied. Scaling to 22°C will increase efficiency by 12%.",
            icon: <Gauge size={20} className="text-blue-400" />
        },
        { 
            id: 2, 
            title: "Luminescent Optimization", 
            impact: "Medium", 
            savings: "0.8 kWh/day", 
            desc: "Kitchen lights have remained active for 4+ hours with zero motion detected. Auto-dimming sequence recommended.",
            icon: <Sparkles size={20} className="text-amber-400" />
        },
        { 
            id: 3, 
            title: "Phantom Load Mitigation", 
            impact: "Low", 
            savings: "0.3 kWh/day", 
            desc: "TV in Room1 is in 'Always-On' standby. Transitioning to Deep Sleep will eliminate residual drain.",
            icon: <TrendingDown size={20} className="text-emerald-400" />
        },
        { 
            id: 4, 
            title: "Diurnal Light Harvesting", 
            impact: "Medium", 
            savings: "1.1 kWh/day", 
            desc: "Ambient illumination levels in Zone 1 are optimal. Artificial ceiling arrays are active despite sufficient sunlight. Manual override recommended.",
            icon: <Sparkles size={20} className="text-cyan-400" />
        }
    ]);

    const efficiencyData = [
        { subject: 'HVAC', A: 120, fullMark: 150 },
        { subject: 'Lighting', A: 98, fullMark: 150 },
        { subject: 'Cooking', A: 86, fullMark: 150 },
        { subject: 'Washing', A: 99, fullMark: 150 },
        { subject: 'Standby', A: 45, fullMark: 150 }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#07080e] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#07080e]/80 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Leaf size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">CORTEX <span className="text-emerald-500 text-xs">GREEN</span></span>
                    </Link>
                    <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
                        <Link to="/chat" className="hover:text-white transition-all flex items-center gap-2 italic">
                            <MessageSquareText size={14} /> Back to Analyzer
                        </Link>
                        <Link to="/dashboard" className="hover:text-white transition-all flex items-center gap-2 italic">
                            <LayoutDashboard size={14} /> Real-time Hub
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                        AI Analyzing Live
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
                {/* Hero section */}
                <header className="mb-12">
                   <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">
                            Sustainability <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 underline decoration-emerald-500/30">Intelligence</span>
                        </h1>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                            Our LLM analyzer has processed your usage history. Here are actionable protocols to minimize carbon footprint and energy expenditure.
                        </p>
                   </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Efficiency Score Card */}
                    <motion.div 
                        variants={itemVariants} initial="hidden" animate="visible"
                        className="bg-[#0f111a] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group"
                    >
                         <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
                         
                         <h3 className="text-lg font-bold mb-8 italic">Diagnostic Score</h3>
                         <div className="flex flex-col items-center justify-center py-10 relative">
                            {/* SVG Progress Ring */}
                            <svg className="w-48 h-48 -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * efficiencyScore) / 100} className="text-emerald-500 transition-all duration-1000 shadow-2xl" strokeLinecap="round" />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-5xl font-black">{efficiencyScore}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Health Index</span>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 mt-10">
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Rank</p>
                                <p className="text-white font-bold text-sm tracking-tight">Optimal v2.4</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Potential</p>
                                <p className="text-emerald-400 font-bold text-sm tracking-tight">+14% Growth</p>
                            </div>
                         </div>
                    </motion.div>

                    {/* Matrix Distribution */}
                    <motion.div 
                        variants={itemVariants} initial="hidden" animate="visible"
                        className="lg:col-span-2 bg-[#0f111a] border border-white/5 rounded-[32px] p-8 shadow-2xl overflow-hidden"
                    >
                         <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold italic">Power Vector Matrix</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                <ShieldCheck size={14} /> Verified AI Analysis
                            </div>
                         </div>
                         <div className="h-[340px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={efficiencyData}>
                                    <PolarGrid stroke="#1e293b" />
                                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontWeight="bold" />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} hide />
                                    <Radar
                                        name="Efficiency"
                                        dataKey="A"
                                        stroke="#10b981"
                                        fill="#10b981"
                                        fillOpacity={0.15}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                         </div>
                    </motion.div>
                </div>

                {/* Financial Insights Hub ⭐ NEW */}
                <motion.div 
                    variants={itemVariants} initial="hidden" animate="visible"
                    className="mt-12 bg-gradient-to-br from-[#0f111a] to-[#07080e] border border-emerald-500/10 rounded-[40px] p-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
                    
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-1/3 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">
                                <TrendingDown size={12} /> Financial Projection
                            </div>
                            <h2 className="text-4xl font-black mb-4 tracking-tighter">Budget <span className="text-emerald-500 font-serif italic text-5xl">Forecasting</span></h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                AI has analyzed your 30-day consumption velocity. At your current rate, your usage is trending toward an high-efficiency threshold.
                            </p>
                            
                            <div className="flex flex-col gap-4 text-left mx-auto lg:mx-0 max-w-[240px]">
                                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 font-extrabold uppercase mb-1">Projected Monthly Bill</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-white leading-none">${energySummary.projected_bill}</span>
                                        <span className="text-[10px] text-red-400 font-bold tracking-tighter">+4.2% vs Last Mo</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                    <p className="text-[10px] text-emerald-400 font-extrabold uppercase mb-1">Potential Net Savings</p>
                                    <div className="flex items-baseline gap-2 relative">
                                        <span className="text-3xl font-black text-emerald-400 leading-none">${energySummary.potential_savings}</span>
                                        <span className="text-[10px] text-emerald-500/60 font-bold tracking-tighter">Optimizable</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-2/3 h-[300px]">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">Daily Cost Vectoring (USD)</h4>
                                <div className="flex gap-4 text-[10px] font-black uppercase text-slate-500">
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Predicted</div>
                                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-800 rounded-full"></div> History</div>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={energySummary.daily_history}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        contentStyle={{backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px'}}
                                    />
                                    <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                                        {energySummary.daily_history.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index > 4 ? '#10b981' : '#1e293b'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* AI Suggestions Table */}
                <motion.section 
                    variants={containerVariants} initial="hidden" animate="visible"
                    className="mt-12"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-emerald-600 rounded-xl flex items-center justify-center">
                            <BrainCircuit size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Protocols to Implement</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Intelligent Suggestions for Optimization</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suggestions.map((s, idx) => (
                            <motion.div 
                                key={s.id}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="bg-slate-900/30 border border-white/5 hover:border-emerald-500/30 p-6 rounded-[28px] transition-all relative group"
                            >
                                <div className="absolute top-6 right-6">
                                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${s.impact === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : s.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                        {s.impact} Impact
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                    {s.icon}
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-slate-100 mb-2">{s.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6 italic">"{s.desc}"</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-[11px] font-medium text-slate-500">Savings Target</span>
                                    <span className="text-sm font-black text-emerald-400">{s.savings}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Footer Insight */}
                <div className="mt-16 p-8 bg-gradient-to-r from-emerald-950/20 to-cyan-950/20 border-l border-emerald-500/50 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-400 shrink-0">
                        <Clock size={32} />
                    </div>
                    <div className="flex-1">
                        <h5 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">Automated Forecast Analysis</h5>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                            By implementing the above protocols within the next 24 hours, your infrastructure is projected to achieve a <span className="text-white font-bold">18% reduction</span> in standby wattage by month-end. System learning window: Open (98% confidence).
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PowerOptimizer;
