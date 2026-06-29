
import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Activity, Brain, ArrowRight, Zap, Database, Lock, LayoutDashboard, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0f111a] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed w-full top-0 z-50 border-b border-slate-800/40 bg-[#0f111a]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                            <Cpu size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">SmartHome Cortex</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/dashboard"
                            className="hidden sm:flex px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
                        >
                            Open Dashboard
                        </Link>
                        <Link
                            to="/login"
                            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Launch App <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Next Gen AI Home Control
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Your Home, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Intelligently Managed.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Experience the power of RAG-enhanced AI. Talk to your home, analyze historical data, and get real-time insights with military-grade verification.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link
                                to="/login"
                                className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5 hover:transform hover:-translate-y-1"
                            >
                                Get Started Now
                            </Link>
                            <Link
                                to="/dashboard"
                                className="w-full md:w-auto px-8 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                            >
                                <LayoutDashboard size={18} className="text-blue-400" /> Live Dashboard
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-900/30 border-y border-slate-800/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Why SmartHome Cortex?</h2>
                        <p className="text-slate-400">Advanced features designed for reliability and control.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Brain size={32} className="text-purple-400" />}
                            title="Natural Language Understanding"
                            desc="Ask complex questions like 'How much energy did the AC use last week?' and get instant, accurate answers."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={32} className="text-emerald-400" />}
                            title="AI Verification Layer"
                            desc="Every AI response is cross-verified against real database records to prevent hallucinations."
                        />
                        <FeatureCard
                            icon={<Activity size={32} className="text-blue-400" />}
                            title="Real-Time Telemetry"
                            desc="Monitor live sensor data from every room in your house with millisecond latency."
                        />
                        <FeatureCard
                            icon={<Database size={32} className="text-orange-400" />}
                            title="Historical Analytics"
                            desc="Long-term data storage allows for trend analysis and anomaly detection over months or years."
                        />
                        <FeatureCard
                            icon={<Lock size={32} className="text-red-400" />}
                            title="Secure & Private"
                            desc="Your data stays local. Enterprise-grade security ensures your home data is never compromised."
                        />
                        <FeatureCard
                            icon={<Leaf size={32} className="text-emerald-400" />}
                            title="AI Sustainability Advisor"
                            desc="Receive personalized, LLM-driven protocols to optimize power efficiency and reduce footprint."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800/40 bg-[#0b0d14]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Cpu size={18} className="text-slate-500" />
                        <span className="text-slate-500 font-semibold">SmartHome Cortex &copy; 2026</span>
                    </div>
                    <div className="flex gap-6 text-slate-500 text-sm">
                        <span className="italic opacity-50">Enterprise Verified Hub</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-2xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/40 transition-all hover:scale-[1.02] group">
        <div className="mb-6 p-4 rounded-xl bg-slate-900/50 w-fit group-hover:bg-slate-900 transition-colors border border-slate-800">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default LandingPage;
