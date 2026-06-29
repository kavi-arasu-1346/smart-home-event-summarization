import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Zap, Activity, Home, MessageSquareText, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HouseViewer from '../components/HouseViewer';

const ZONES = [
    { id: 'Room1', name: 'Zone 1 (Living Room)' },
    { id: 'Room2', name: 'Zone 2 (Bedroom)' },
    { id: 'Room3', name: 'Zone 3 (Office)' },
    { id: 'Kitchen', name: 'Zone 4 (Kitchen)' }
];

export default function SpatialView() {
    const [currentZone, setCurrentZone] = useState('Room1');
    const [deviceStatuses, setDeviceStatuses] = useState({
        Room1: 'off',
        Room2: 'off',
        Room3: 'off',
        Kitchen: 'off'
    });
    const [energyMetrics, setEnergyMetrics] = useState({
        Room1: 0.00,
        Room2: 0.00,
        Room3: 0.00,
        Kitchen: 0.00
    });
    const [actionLoading, setActionLoading] = useState(null);
    const [apiMessage, setApiMessage] = useState(null);

    // Fetch device statuses and energy metrics
    const fetchLiveStats = async () => {
        try {
            const res = await fetch('/get_live_events');
            if (res.ok) {
                const data = await res.json();
                const statuses = { Room1: 'off', Room2: 'off', Room3: 'off', Kitchen: 'off' };
                const energy = { Room1: 0.12, Room2: 0.08, Room3: 0.15, Kitchen: 0.22 };

                data.forEach(device => {
                    if (device.device_type === 'light') {
                        statuses[device.room] = device.status || 'off';
                        // Only Bedroom (Room2) has a real device, so only parse its energy telemetry.
                        // Other rooms stay 0.00 to avoid displaying false energy consumption.
                        if (device.room === 'Room2' && device.energy_consumption) {
                            energy[device.room] = parseFloat(device.energy_consumption).toFixed(2);
                        }
                    }
                });
                // Ensure other rooms are strictly 0.00
                energy.Room1 = 0.00;
                energy.Room3 = 0.00;
                energy.Kitchen = 0.00;
                setDeviceStatuses(statuses);
                setEnergyMetrics(energy);
            }
        } catch (err) {
            console.error("Failed to fetch live stats", err);
        }
    };

    useEffect(() => {
        fetchLiveStats();
        const interval = setInterval(fetchLiveStats, 5000);
        return () => clearInterval(interval);
    }, []);

    // Toggle bulb ON/OFF directly via backend RAG execution pipeline
    const toggleBulb = async (zoneId) => {
        // Enforce the rule: ONLY the Bedroom (Room2) has smart devices.
        // Clicking any other room's toggle displays a "No devices found in this room" error.
        if (zoneId !== 'Room2') {
            setApiMessage({
                type: 'error',
                text: "No devices found in this room"
            });
            // Auto hide message after 4s
            setTimeout(() => setApiMessage(null), 4000);
            return;
        }

        const currentStatus = deviceStatuses[zoneId];
        const nextAction = currentStatus === 'on' ? 'off' : 'on';
        const zoneName = ZONES.find(z => z.id === zoneId)?.name || zoneId;
        const queryText = `turn ${nextAction} the light in ${zoneName}`;

        setActionLoading(zoneId);
        setApiMessage(null);

        try {
            const formData = new FormData();
            formData.append('question', queryText);

            const res = await fetch('/process_query', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const result = await res.json();
                setApiMessage({
                    type: 'success',
                    text: result.final_summary || `Turned ${nextAction.toUpperCase()} successfully.`
                });
                // Optimistic state update
                setDeviceStatuses(prev => ({
                    ...prev,
                    [zoneId]: nextAction
                }));
                // Fetch fresh status to confirm
                setTimeout(fetchLiveStats, 1000);
            } else {
                setApiMessage({
                    type: 'error',
                    text: `Failed to trigger smart device control command.`
                });
            }
        } catch (err) {
            console.error("Device action error:", err);
            setApiMessage({
                type: 'error',
                text: `Connection failed. Make sure Flask RAG system is online.`
            });
        } finally {
            setActionLoading(null);
            // Auto hide message after 4s
            setTimeout(() => setApiMessage(null), 4000);
        }
    };

    return (
        <div className="w-screen h-screen bg-[#08090f] text-slate-100 flex flex-col overflow-hidden font-['Outfit',sans-serif]">
            {/* Header Navigation */}
            <header className="h-16 shrink-0 border-b border-slate-800/80 bg-[#0d0e16]/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <Link
                        to="/chat"
                        className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 hover:text-white transition-all active:scale-95 flex items-center gap-1"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Back</span>
                    </Link>
                    <div className="h-6 w-[1px] bg-slate-800"></div>
                    <div className="flex items-center gap-2">
                        <Home size={18} className="text-blue-500" />
                        <h1 className="text-sm font-bold tracking-wider uppercase text-slate-200">
                            Spatial intelligence <span className="text-blue-500">Center</span>
                        </h1>
                    </div>
                </div>

                {/* API Toast Notifications */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
                    <AnimatePresence>
                        {apiMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className={`px-4 py-2.5 rounded-xl border backdrop-blur-md text-xs font-semibold shadow-2xl flex items-center gap-2 ${apiMessage.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                    }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                {apiMessage.text}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Quick Stats Summary */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/25">
                        <Zap size={14} className="text-blue-400 animate-pulse" />
                        <span className="text-xs text-slate-400 font-medium">
                            System Power: <span className="text-blue-400 font-bold">{(Object.values(energyMetrics).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)).toFixed(2)} kWh</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/25">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Cortex Online</span>
                    </div>
                </div>
            </header>

            {/* Main Command Center Layout */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

                {/* Center 3D spatial intelligence Canvas column */}
                <div className="flex-1 h-2/3 lg:h-full bg-[#07080d] relative shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]">
                    <HouseViewer
                        currentZone={currentZone}
                        onZoneChange={setCurrentZone}
                        deviceStatuses={deviceStatuses}
                        energyMetrics={energyMetrics}
                    />

                    {/* Dynamic Floating Zone Controller */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-lg bg-[#0d0e16]/80 backdrop-blur-md border border-slate-800/80 p-2 rounded-2xl shadow-2xl flex gap-1">
                        {ZONES.map((zone) => (
                            <button
                                key={zone.id}
                                onClick={() => setCurrentZone(zone.id)}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${currentZone === zone.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/35'
                                    }`}
                            >
                                {zone.id === 'Room1' ? 'Living Room' : zone.id === 'Room2' ? 'Bedroom' : zone.id === 'Room3' ? 'Office' : 'Kitchen'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Interactive Command Sidebar */}
                <div className="w-full lg:w-[350px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-[#0d0e15] flex flex-col p-6 overflow-y-auto shadow-[-10px_0_30px_rgba(0,0,0,0.4)] z-10">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold tracking-wide text-[10px] uppercase mb-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                            <Activity size={12} /> System controls
                        </div>
                        <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wider">Device Command Room</h2>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                            Observe real-time sensor metrics and trigger automated device toggles integrated through bidirectional RAG communication.
                        </p>
                    </div>

                    <div className="h-[1px] bg-slate-800/60 mb-6"></div>

                    {/* Room Smart Toggles List */}
                    <div className="flex flex-col gap-4 flex-1">
                        {ZONES.map((zone) => {
                            const isBulbOn = deviceStatuses[zone.id] === 'on';
                            const energy = energyMetrics[zone.id];
                            const isFocused = currentZone === zone.id;

                            return (
                                <div
                                    key={zone.id}
                                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group ${isFocused
                                            ? 'bg-slate-900/50 border-blue-500/40 shadow-[0_4px_25px_rgba(59,130,246,0.08)] scale-[1.02]'
                                            : 'bg-slate-800/10 border-slate-800/80 hover:border-slate-700/60 hover:bg-slate-800/20'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${isFocused ? 'text-blue-400' : 'text-slate-400'}`}>
                                                {zone.id === 'Room1' ? 'Zone 1 (Living Room)' : zone.id === 'Room2' ? 'Zone 2 (Bedroom)' : zone.id === 'Room3' ? 'Zone 3 (Office)' : 'Zone 4 (Kitchen)'}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 uppercase">
                                                Connected IoT Smart Bulb
                                            </span>
                                        </div>
                                        {/* Cinematic Pulse Light */}
                                        <div className={`w-3 h-3 rounded-full ${isBulbOn ? 'bg-yellow-400 shadow-[0_0_12px_#eab308] animate-pulse' : 'bg-slate-700'}`}></div>
                                    </div>

                                    <div className="flex gap-4 bg-black/35 px-4 py-2.5 rounded-xl border border-slate-800/50">
                                        <div className="flex-1 flex flex-col">
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">State</span>
                                            <span className={`text-xs font-bold mt-0.5 uppercase ${isBulbOn ? 'text-yellow-400 font-extrabold' : 'text-slate-400'}`}>
                                                {isBulbOn ? 'Active (ON)' : 'Inactive (OFF)'}
                                            </span>
                                        </div>
                                        <div className="w-[1px] bg-slate-800"></div>
                                        <div className="flex-1 flex flex-col">
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Consumption</span>
                                            <span className="text-xs font-bold mt-0.5 text-slate-300 flex items-center gap-1">
                                                <Zap size={12} className="text-blue-400" />
                                                {energy} kWh
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Toggle Button */}
                                    <button
                                        disabled={actionLoading === zone.id}
                                        onClick={() => toggleBulb(zone.id)}
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${isBulbOn
                                                ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-600/30'
                                            } active:scale-[0.98] disabled:opacity-50`}
                                    >
                                        {actionLoading === zone.id ? (
                                            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Lightbulb size={13} className={isBulbOn ? 'fill-yellow-400/20' : ''} />
                                                Turn {isBulbOn ? 'OFF' : 'ON'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 px-4 py-3 rounded-2xl bg-blue-950/10 border border-blue-900/30 flex items-start gap-3">
                        <ShieldAlert size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-[10px] text-slate-400 leading-normal">
                            All command transactions execute direct socket-level IoT toggles routed through the SmartHome Cortex bidirectional gateway.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
