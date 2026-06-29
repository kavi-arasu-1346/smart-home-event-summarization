import React, { useState } from 'react';
import { Database, History, ChevronDown, FileText, ShieldCheck, ShieldAlert, Activity, User, Bot, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrustScoreGauge, HallucinationDiff, DataSourceBadge } from './EnhancedVisualizations';

const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    const isBot = !isUser;



    const verificationStatus = message.verification_status || 'UNKNOWN';
    const isVerified = verificationStatus === 'CLEAN';
    const isHallucinated = verificationStatus === 'HALLUCINATED' || message.was_regenerated;

    // --- USER MESSAGE ---
    if (isUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full mb-8 justify-end"
            >
                <div className="flex flex-col items-end max-w-[85%]">
                    <div className="flex items-center gap-3 mb-2 flex-row-reverse opacity-80">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg bg-blue-600 text-white ring-2 ring-blue-500 ring-opacity-20 shadow-blue-500/20">
                            <User size={14} />
                        </div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">You</span>
                        <span className="text-[10px] text-slate-600 font-mono">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-blue-50 px-6 py-4 rounded-2xl rounded-tr-sm shadow-xl backdrop-blur-sm">
                        <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium tracking-wide">
                            {message.content}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- BOT MESSAGE ---
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full mb-10 justify-start"
        >
            <div className="flex flex-col items-start w-full max-w-4xl opacity-100">

                {/* Bot Header Row */}
                <div className="flex items-center gap-3 mb-3 w-full pl-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shadow-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white ring-1 ring-purple-400/30 shadow-purple-500/20">
                        <Bot size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-200 font-bold uppercase tracking-wider">Cortex AI</span>
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* Verification Badge (Top Right) */}
                    <div className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shadow-lg ${isVerified
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10'
                        : isHallucinated
                            ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 shadow-amber-500/10'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                        }`}>
                        {isVerified ? <ShieldCheck size={14} /> : isHallucinated ? <ShieldAlert size={14} /> : <Activity size={14} />}
                        <span>{isVerified ? 'Verified & Secure' : isHallucinated ? 'Hallucination Corrected' : 'Processing...'}</span>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="w-full bg-[#0f111a]/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl ring-1 ring-white/5">

                    {/* SECTION 1: Executive Summary */}
                    <div className="p-6 md:p-8 border-b border-slate-800/50 relative">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

                        <div className="flex items-center gap-2 mb-4">
                            <FileText size={14} className="text-blue-400" />
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Analysis Summary</h3>
                        </div>

                        {/* Summary Text */}
                        <div className="whitespace-pre-wrap leading-relaxed text-slate-300 text-sm md:text-[15px] font-light tracking-wide">
                            {message.content}
                        </div>

                        {/* Hallucination Diff (if applicable) */}
                        {message.was_regenerated && message.original_summary && (
                            <div className="mt-6 pt-6 border-t border-slate-800/50 border-dashed">
                                <h4 className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ShieldAlert size={12} />
                                    Correction Log
                                </h4>
                                <HallucinationDiff
                                    original={message.original_summary}
                                    final={message.content}
                                />
                            </div>
                        )}
                    </div>

                    {/* SECTION 3: Trust Analysis Gauge - Conditionally Rendered */}
                    {message.trust_score !== undefined && (
                        <div className="p-6 md:p-8 bg-[#0b0d14]/80 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    PhD Verification Layer
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    This response has been mathematically verified against ground-truth data.
                                    Scale 0-1 represents provenance reliability.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <TrustScoreGauge
                                    score={message.trust_score}
                                    confidence={message.confidence_score}
                                    source={message.data_source || 'Live Sensors'}
                                />
                            </div>
                        </div>
                    )}

                    {/* SECTION 4: System Internals (Accordion Footer) */}
                    <div className="bg-[#050608]">
                        <DetailSection
                            title="SQL Query Execution Log"
                            icon={<Database size={12} className="text-blue-400" />}
                            content={message.sql_queries}
                            isCode={true}
                        />
                        <DetailSection
                            title="Context Memory & Vector Insights"
                            icon={<History size={12} className="text-purple-400" />}
                            content={message.vector_insights}
                            isList={true}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Helper Component for Accordion Details ---
const DetailSection = ({ title, icon, content, isCode, isList }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Guard clauses to prevent empty sections
    if (!content) return null;
    if (Array.isArray(content) && content.length === 0) return null;
    if (typeof content === 'string' && content.trim() === "") return null;

    return (
        <div className="border-t border-slate-800/50 first:border-t-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 md:px-8 py-3 hover:bg-white/[0.02] transition-colors group cursor-pointer"
            >
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 group-hover:text-slate-400 transition-colors uppercase tracking-widest">
                    {icon}
                    <span>{title}</span>
                </div>
                <div className={`p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-800 rotate-180' : 'bg-transparent'}`}>
                    <ChevronDown size={14} className="text-slate-600 group-hover:text-slate-400" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden bg-[#000000]/40"
                    >
                        <div className="px-6 md:px-8 pb-6 pt-2 text-xs text-slate-400">
                            {isCode ? (
                                <div className="font-mono bg-[#0b0d14] p-4 rounded-lg border border-slate-800/80 overflow-x-auto whitespace-pre text-emerald-400/90 shadow-inner custom-scrollbar relative">
                                    <div className="absolute top-2 right-2 text-[9px] text-slate-600 font-bold uppercase tracking-widest">SQL</div>
                                    {content}
                                </div>
                            ) : isList ? (
                                <ul className="space-y-2">
                                    {content.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-slate-400 leading-relaxed bg-slate-900/20 p-3 rounded border border-slate-800/30 hover:border-slate-700/50 transition-colors">
                                            <span className="text-purple-500 mt-1 flex-shrink-0">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div>{content}</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MessageBubble;
