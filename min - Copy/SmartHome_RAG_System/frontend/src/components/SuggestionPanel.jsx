
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Thermometer, Droplets, Fan } from 'lucide-react';

const suggestions = [
    {
        icon: <Zap size={16} />,
        text: "What is the current status of the light in Room1?"
    },
    {
        icon: <Activity size={16} />,
        text: "How much power is the light in Room1 consuming right now?"
    },
    {
        icon: <Thermometer size={16} />,
        text: "What is the total energy consumed by all devices?"
    },
    {
        icon: <Fan size={16} />,
        text: "Is the fan in Room2 running?"
    }
];

const SuggestionPanel = ({ onSelect }) => {
    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">Suggested Queries</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((s, idx) => (
                    <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => onSelect(s.text)}
                        className="flex items-center gap-3 p-4 bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 rounded-xl text-left transition-all hover:-translate-y-0.5 hover:border-blue-500/30 group shadow-sm hover:shadow-md"
                    >
                        <div className="p-2 bg-slate-700/50 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors group-hover:bg-blue-500/20">
                            {s.icon}
                        </div>
                        <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                            {s.text}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default SuggestionPanel;
