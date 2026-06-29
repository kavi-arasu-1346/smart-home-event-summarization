import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, RotateCw, Home, Cpu, BrainCircuit, MessageSquareText, Zap, Droplets, Fan, Tv, Lightbulb, Wind, Flame, ChevronLeft, Activity, Mic, MicOff, Volume2, LayoutDashboard, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '../components/MessageBubble';
import DashboardView from '../components/DashboardView';

const ZONES = [
    { id: 'Room1', name: 'Zone 1 (Living Room)' },
    { id: 'Room2', name: 'Zone 2 (Bedroom)' },
    { id: 'Room3', name: 'Zone 3 (Office)' },
    { id: 'Kitchen', name: 'Zone 4 (Kitchen)' }
];

const ZONE_DEVICES = {
    'Room1': [
        { id: 'tv', name: 'TV', icon: <Tv size={28} /> },
        { id: 'fan', name: 'Fan', icon: <Fan size={28} /> },
        { id: 'light', name: 'Smart Bulb', icon: <Lightbulb size={28} /> }
    ],
    'Room2': [
        { id: 'washing_machine', name: 'Washing Machine', icon: <Droplets size={28} /> },
        { id: 'fan', name: 'Fan', icon: <Fan size={28} /> },
        { id: 'light', name: 'Smart Bulb', icon: <Lightbulb size={28} /> }
    ],
    'Room3': [
        { id: 'ac', name: 'Air Conditioner', icon: <Wind size={28} /> },
        { id: 'fan', name: 'Fan', icon: <Fan size={28} /> },
        { id: 'light', name: 'Smart Bulb', icon: <Lightbulb size={28} /> }
    ],
    'Kitchen': [
        { id: 'oven', name: 'Smart Oven', icon: <Flame size={28} /> },
        { id: 'light', name: 'Smart Bulb', icon: <Lightbulb size={28} /> }
    ]
};

const DEVICE_QUESTIONS = {
    'Room1': {
        'tv': [
            { icon: <Tv size={16} />, text: 'What is the status of the TV in Room1?' },
            { icon: <Zap size={16} />, text: 'How much energy did the TV in Room1 consume?' },
            { icon: <MessageSquareText size={16} />, text: 'What is the playback status of the TV in Room1?' },
            { icon: <Activity size={16} />, text: 'How long has the TV in Room1 been used?' },
            { icon: <MessageSquareText size={16} />, text: 'Compare the TV energy usage with the fan in Room1' }
        ],
        'fan': [
            { icon: <Fan size={16} />, text: 'Is the fan in Room1 running?' },
            { icon: <Zap size={16} />, text: 'What is the speed of the fan in Room1?' },
            { icon: <Zap size={16} />, text: 'Energy consumption of fan in Room1?' },
            { icon: <Activity size={16} />, text: 'How long has the fan in Room1 been running?' },
            { icon: <MessageSquareText size={16} />, text: 'Show me the recent history of the Room1 fan' }
        ],
        'light': [
            { icon: <Lightbulb size={16} />, text: 'Are the lights on in Room1?' },
            { icon: <Zap size={16} />, text: 'How much energy did Room1 lights consume?' },
            { icon: <Activity size={16} />, text: 'What is the current power consumption of Room 1 light?' },
            { icon: <MessageSquareText size={16} />, text: 'Summarize the status of the light in Room1' },
            { icon: <Lightbulb size={16} />, text: 'Show me the recent history of Room1 light' },
            { icon: <Zap size={16} />, text: 'Compare Room1 light energy usage to Room2 light' }
        ]
    },
    'Room2': {
        'washing_machine': [
            { icon: <Droplets size={16} />, text: 'What mode is the washing machine in Room2 running?' },
            { icon: <Droplets size={16} />, text: 'Water consumption of washing machine in Room2?' },
            { icon: <Zap size={16} />, text: 'Energy consumption of washing machine in Room2?' },
            { icon: <Activity size={16} />, text: 'Is the washing machine currently washing clothes?' },
            { icon: <MessageSquareText size={16} />, text: 'How long has the washing machine been on today?' }
        ],
        'fan': [
            { icon: <Fan size={16} />, text: 'Is the fan in Room2 on?' },
            { icon: <Zap size={16} />, text: 'What is the fan speed in Room2?' },
            { icon: <Activity size={16} />, text: 'How long has the Room2 fan been running?' },
            { icon: <Zap size={16} />, text: 'Compare fan speeds in Room1 and Room2' }
        ],
        'light': [
            { icon: <Lightbulb size={16} />, text: 'Status of lights in Room2?' },
            { icon: <Zap size={16} />, text: 'Energy usage of Room2 lights?' },
            { icon: <Lightbulb size={16} />, text: 'Are the lights on in Room2 right now?' },
            { icon: <MessageSquareText size={16} />, text: 'Compare light energy usage in Room1 and Room2' }
        ]
    },
    'Room3': {
        'ac': [
            { icon: <Wind size={16} />, text: 'What is the temperature of the AC in Room3?' },
            { icon: <Wind size={16} />, text: 'Is the AC in Room3 on?' },
            { icon: <Zap size={16} />, text: 'How much power did the AC in Room3 use?' },
            { icon: <Activity size={16} />, text: 'How much energy does the AC in Room3 consume per hour?' },
            { icon: <MessageSquareText size={16} />, text: 'What is the status of AC in Room3?' }
        ],
        'fan': [
            { icon: <Fan size={16} />, text: 'Is the fan in Room3 on?' },
            { icon: <Zap size={16} />, text: 'Fan speed in Room3?' },
            { icon: <Activity size={16} />, text: 'What is the energy consumption of Room3 fan?' },
            { icon: <MessageSquareText size={16} />, text: 'Compare Room3 fan speed to Room1 fan speed' }
        ],
        'light': [
            { icon: <Lightbulb size={16} />, text: 'Are the lights on in Room3?' },
            { icon: <Zap size={16} />, text: 'Energy consumption of light in Room3' },
            { icon: <Activity size={16} />, text: 'How long did the lights stay on in Room3 today?' },
            { icon: <MessageSquareText size={16} />, text: 'Status of the light in Room3' }
        ]
    },
    'Kitchen': {
        'oven': [
            { icon: <Flame size={16} />, text: 'What mode is the oven in the Kitchen?' },
            { icon: <Flame size={16} />, text: 'Is the Kitchen oven turned on?' },
            { icon: <Zap size={16} />, text: 'Power consumption of the oven in the Kitchen?' },
            { icon: <Activity size={16} />, text: 'How long has the oven been on in the Kitchen?' },
            { icon: <MessageSquareText size={16} />, text: 'Compare oven energy usage to washing machine' }
        ],
        'light': [
            { icon: <Lightbulb size={16} />, text: 'Are the Kitchen lights on?' },
            { icon: <Zap size={16} />, text: 'Energy usage of Kitchen lights?' },
            { icon: <Activity size={16} />, text: 'What is the status of the Kitchen light?' },
            { icon: <MessageSquareText size={16} />, text: 'Show me the recent history of Kitchen lights' },
            { icon: <Zap size={16} />, text: 'Compare light energy usage across all rooms' }
        ]
    }
};

function ChatInterface() {
    const [query, setQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Zone and Device selection state
    const [currentZone, setCurrentZone] = useState('Room1');
    const [currentDevice, setCurrentDevice] = useState(null);

    // Controls visibility of the main chat panel
    const [hasInteracted, setHasInteracted] = useState(false);

    // Mobile Tab State
    const [activeMobileTab, setActiveMobileTab] = useState('adviser');

    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'bot',
            content: "Hello! I am Assistant 2, your Main Cortex Analyzer. I am observing the network. Waiting for your query...",
            timestamp: new Date().toISOString()
        }
    ]);

    const [isDashboardOpen, setIsDashboardOpen] = useState(true);
    const [dashRefreshTrigger, setDashRefreshTrigger] = useState(0);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                setIsListening(false);
                // Optionally auto-process
                // processQuery(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakResponse = (text) => {
        if (!isSpeaking) return;
        window.speechSynthesis.cancel();
        const utterance = new SynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    // Correcting a small typo in common browser global name
    const SynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;


    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Handle Zone Change
    const handleZoneChange = (zoneId) => {
        setCurrentZone(zoneId);
        setCurrentDevice(null); // Reset device selection when switching zones
    };

    const processQuery = async (overrideQuery = null) => {
        const textToProcess = overrideQuery || query;
        if (!textToProcess.trim()) return;

        if (!hasInteracted) setHasInteracted(true); // Show Assistant 2!
        setActiveMobileTab('analyzer');

        const userMsg = {
            id: Date.now().toString(),
            type: 'user',
            content: textToProcess,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setQuery(""); // Clear input
        setIsTyping(true);

        try {
            const formData = new FormData();
            formData.append('question', userMsg.content);
            
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id !== undefined) {
                formData.append('user_id', user.id);
            }

            const res = await fetch('/process_query', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            // Perform Verification
            const verificationPayload = {
                question: userMsg.content,
                sql_results: data.sql_queries || {},
                vector_insights: Array.isArray(data.vector_insights) ? data.vector_insights : [],
                summary: data.final_summary
            };

            let verificationData = null;
            try {
                const vRes = await fetch('/detect_hallucination', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(verificationPayload)
                });
                verificationData = await vRes.json();
            } catch (vErr) {
                console.error("Verification failed", vErr);
            }

            const botMsg = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: data.final_summary,
                sql_results: data.sql_queries,
                vector_insights: data.vector_insights,
                was_regenerated: data.was_regenerated,
                original_summary: data.original_summary,
                data_source: data.data_source,
                verification_status: data.verification_status,
                trust_score: data.trust_score,
                confidence_score: data.confidence_score,
                reason: data.reason,
                verification: verificationData,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMsg]);
            
            // Voice Analysis: Hear the bot reply
            speakResponse(data.final_summary);

            // Reactive Dashboard: Trigger refresh
            setDashRefreshTrigger(prev => prev + 1);

        } catch (err) {
            console.error(err);
            const errorMsg = {
                id: Date.now().toString(),
                type: 'bot',
                content: "I encountered an error processing your request. Please check your connection and try again.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            processQuery();
        }
    };

    const handleSuggestionSelect = (text) => {
        setQuery(text);
        setHasInteracted(true);
        setActiveMobileTab('analyzer');
    };

    return (
        <div className="flex flex-col h-screen w-full bg-[#0f111a] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">

            {/* BACKGROUND ACCENTS */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <div className="relative h-16 border-b border-slate-800/80 flex items-center justify-between px-6 bg-[#0f111a]/90 backdrop-blur-md z-30 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:shadow-md transition-all border border-slate-700/50"
                        title="Back to Home"
                    >
                        <Home size={18} />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Cpu className="text-blue-500" size={20} />
                        <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">Cortex Dual-Bot System</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                        className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isDashboardOpen ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                    >
                        <LayoutDashboard size={16} /> {isDashboardOpen ? "Hide Metrics" : "Show Metrics"}
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden hidden sm:block">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff" alt="User" />
                    </div>
                </div>
            </div>

            {/* Horizontal Zone Selector */}
            <div className="w-full bg-[#141724]/80 border-b border-slate-800/80 p-4 shrink-0 shadow-lg relative z-20 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Target Operating Zone</h3>
                    <div className="flex flex-wrap justify-center items-center gap-3">
                        {ZONES.map(zone => (
                            <button
                                key={zone.id}
                                onClick={() => handleZoneChange(zone.id)}
                                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border flex items-center gap-2 ${currentZone === zone.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
                            >
                                {currentZone === zone.id && <Zap size={16} className="text-yellow-300 animate-pulse" />}
                                {zone.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="md:hidden w-full flex border-b border-slate-800/80 bg-[#141724] shrink-0">
                <button
                    onClick={() => setActiveMobileTab('adviser')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeMobileTab === 'adviser' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <MessageSquareText size={16} /> Assistant 1
                </button>
                <button
                    onClick={() => setActiveMobileTab('analyzer')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeMobileTab === 'analyzer' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <BrainCircuit size={16} /> Assistant 2
                </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                {/* ---------- Assistant 1: Suggestion Bot ---------- */}
                <div className={`w-full md:w-1/3 lg:w-1/4 bg-[#11131e] border-r border-slate-800/60 flex-col pt-6 pb-6 shadow-[inset_-10px_0_20px_rgba(0,0,0,0.2)] ${activeMobileTab === 'adviser' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="px-6 mb-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold tracking-wide text-xs uppercase mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <MessageSquareText size={14} /> Assistant 1 (Adviser)
                        </div>
                        <h2 className="text-xl font-bold text-slate-100 mt-2">
                            {currentDevice ? `Questions for ${currentDevice.name}` : `Devices in ${ZONES.find(z => z.id === currentZone)?.name}`}
                        </h2>
                        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                            {!currentDevice
                                ? "Select a device to view available queries."
                                : "Click a suggestion below to analyze."}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
                        <div className="flex flex-col gap-4 pb-8 items-center md:items-stretch">

                            <AnimatePresence mode="popLayout" initial={false}>
                                {/* VIEW 1: Show Devices */}
                                {!currentDevice && (
                                    <div className="grid gap-4 w-full grid-cols-1">
                                        {ZONE_DEVICES[currentZone]?.map((device, idx) => (
                                            <motion.button
                                                key={`device-${device.id}`}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => setCurrentDevice(device)}
                                                className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-800/40 hover:bg-slate-700/80 border border-slate-700/50 rounded-2xl transition-all hover:border-blue-500/50 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)] group"
                                            >
                                                <div className="p-4 bg-slate-900/80 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner group-hover:scale-110">
                                                    {device.icon}
                                                </div>
                                                <span className="text-base font-semibold text-slate-300 group-hover:text-white transition-colors">
                                                    {device.name}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* VIEW 2: Show Questions for Selected Device */}
                                {currentDevice && (
                                    <motion.div
                                        key="questions-view"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="w-full flex flex-col gap-3"
                                    >
                                        <button
                                            onClick={() => setCurrentDevice(null)}
                                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white mb-4 transition-colors w-fit border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 rounded-lg"
                                        >
                                            <ChevronLeft size={16} /> Back to Devices
                                        </button>

                                        {DEVICE_QUESTIONS[currentZone]?.[currentDevice.id]?.map((q, idx) => (
                                            <motion.button
                                                key={q.text}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('text/plain', q.text);
                                                }}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.08 }}
                                                onClick={() => handleSuggestionSelect(q.text)}
                                                className="flex items-start gap-3 p-4 bg-slate-800/40 hover:bg-slate-700 border border-slate-700/50 rounded-2xl text-left transition-all hover:border-indigo-500/50 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)] group cursor-grab active:cursor-grabbing"
                                            >
                                                <div className="p-2 bg-slate-900/80 rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner shrink-0">
                                                    {q.icon}
                                                </div>
                                                <div className="flex-1 mt-0.5">
                                                    <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors leading-snug block">
                                                        {q.text}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>
                </div>

                {/* ---------- Assistant 2: Main Analyzer Bot ---------- */}
                <div className={`flex-1 flex-col relative w-full bg-[#0f111a] ${activeMobileTab === 'analyzer' ? 'flex' : 'hidden md:flex'}`}>
                    <AnimatePresence mode="wait">
                        {!hasInteracted ? (
                            <motion.div
                                key="logo-view"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group z-10"
                                onClick={() => setHasInteracted(true)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setHasInteracted(true);
                                    const text = e.dataTransfer.getData('text/plain');
                                    if (text) setQuery(text);
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-40 h-40 rounded-full bg-blue-500/5 border border-blue-500/20 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_80px_rgba(59,130,246,0.25)] group-hover:bg-blue-500/10 transition-all duration-500"
                                >
                                    <BrainCircuit size={72} strokeWidth={1.5} className="text-blue-500/70 group-hover:text-blue-400 group-hover:animate-pulse transition-colors" />
                                </motion.div>
                                <div className="mt-8 text-center flex flex-col items-center">
                                    <h3 className="text-xl font-bold text-slate-300 tracking-widest uppercase mb-3 px-4 py-1.5 border border-slate-700/50 rounded-full bg-slate-800/30">
                                        Assistant 2
                                    </h3>
                                    <p className="text-sm text-slate-500 max-w-sm mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        Click here or drop a query to awaken the <span className="text-blue-400 font-semibold">Main Analyzer</span>.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col h-full w-full relative"
                            >
                                {/* Bot 2 Header overlay */}
                                <div className="absolute top-0 w-full py-3 px-6 bg-gradient-to-b from-[#0f111a] via-[#0f111a]/95 to-transparent z-10 flex items-center justify-between border-b border-transparent">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold tracking-wide text-xs uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                        <BrainCircuit size={14} className="animate-pulse" /> Assistant 2 (Main Analyzer)
                                    </div>
                                </div>

                                {/* Messages List */}
                                <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-16 pb-32 custom-scrollbar scroll-smooth">
                                    <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
                                        <AnimatePresence>
                                            {messages.map((msg) => (
                                                <MessageBubble key={msg.id} message={msg} />
                                            ))}
                                        </AnimatePresence>

                                        {/* Typing Indicator */}
                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-3 mt-6 mb-2 ml-4 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl w-fit drop-shadow-md"
                                            >
                                                <BrainCircuit className="text-blue-500 animate-pulse" size={20} />
                                                <div className="flex gap-1.5">
                                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                </div>
                                                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider ml-1">Analyzing Data...</span>
                                            </motion.div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="absolute bottom-0 w-full p-4 md:p-6 pb-6 bg-gradient-to-t from-[#090a0f] via-[#0f111a]/95 to-transparent z-20 pointer-events-none">
                                    <div className="w-full max-w-4xl mx-auto pointer-events-auto">
                                        <div
                                            className="bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2.5 flex items-end gap-3 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500/50 transition-all hover:bg-[#1e293b]"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const text = e.dataTransfer.getData('text/plain');
                                                if (text) setQuery(text);
                                                if (!hasInteracted) setHasInteracted(true);
                                            }}
                                        >
                                            <button
                                                onClick={() => setIsSpeaking(!isSpeaking)}
                                                className={`p-2.5 rounded-lg mb-1.5 ml-1.5 transition-all ${isSpeaking ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
                                                title={isSpeaking ? "Narrate bot replies: ON" : "Narrate bot replies: OFF"}
                                            >
                                                <Volume2 size={20} className={isSpeaking ? "animate-pulse" : ""} />
                                            </button>

                                            <textarea
                                                className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 px-4 py-3 resize-none custom-scrollbar font-normal text-[15px] leading-relaxed"
                                                placeholder={isListening ? "Listening..." : "Type or drag a question here..."}
                                                rows={1}
                                                style={{ minHeight: '52px', maxHeight: '120px' }}
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />

                                            <button
                                                onClick={toggleListening}
                                                className={`
                                                    h-12 w-12 flex items-center justify-center rounded-xl mb-0.5 transition-all duration-300
                                                    ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-400 hover:text-blue-400 border border-slate-700'}
                                                `}
                                                title={isListening ? "Stop listening" : "Start voice input"}
                                            >
                                                {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                                            </button>

                                            <button
                                                onClick={() => processQuery()}
                                                disabled={isTyping || !query.trim()}
                                                className={`
                                                    h-12 w-12 flex items-center justify-center rounded-xl mb-0.5 mx-0.5 transition-all duration-300
                                                    ${isTyping || !query.trim()
                                                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95'}
                                                `}
                                            >
                                                {isTyping ? <RotateCw className="animate-spin text-white" size={22} /> : <Send size={20} className="ml-1" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* ---------- Dashboard Integrated Panel ---------- */}
                <AnimatePresence>
                    {isDashboardOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '28%', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="hidden lg:flex flex-col border-l border-slate-800/80 bg-[#0c0e16] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] relative z-10"
                        >
                            <div className="flex-1 overflow-hidden h-full">
                                <DashboardView 
                                    isCompact={true} 
                                    refreshTrigger={dashRefreshTrigger} 
                                    onZoneSelect={setCurrentZone}
                                    currentZone={currentZone}
                                    currentDevice={currentDevice}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

export default ChatInterface;
