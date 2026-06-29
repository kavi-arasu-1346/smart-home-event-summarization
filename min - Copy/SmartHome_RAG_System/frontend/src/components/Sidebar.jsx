
import React from 'react';
import { Cpu, Activity, Zap, Thermometer, Droplets, Monitor, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, currentRoom, setCurrentRoom, events, onQuery }) => {

    const rooms = ['Room1', 'Room2', 'Room3', 'Kitchen', 'Bathroom', 'Toilet'];

    return (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-[350px] bg-[#0f111a]/95 backdrop-blur-2xl border-r border-slate-800/60 shadow-2xl z-[100] flex flex-col"
        >
            {/* Header Area */}
            <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                        <Cpu size={22} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight leading-none">SmartHome</h1>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Live Dashboard</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Room Selector */}
            <div className="px-6 py-8">
                <div className="flex items-center justify-between mb-4 px-1 cursor-pointer group" onClick={() => onQuery(`What is the status of ${currentRoom}?`) && onClose()}>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-400 transition-colors">Active Monitoring Zone</span>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">LIVE</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {rooms.map(room => (
                        <button
                            key={room}
                            onClick={() => setCurrentRoom(room)}
                            className={`
                                relative px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 border flex items-center justify-center
                                ${currentRoom === room
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/50'
                                    : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 hover:border-slate-600'}
                            `}
                        >
                            {room.replace('Room', 'Zone ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Device List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar space-y-4">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <Activity size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Telemetry Feed</span>
                </div>

                {events.length === 0 ? (
                    <div
                        onClick={() => { onQuery(`Why are there no active signals in ${currentRoom}? Check history.`); onClose(); }}
                        className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20 cursor-pointer hover:border-slate-700 hover:bg-slate-800/30 transition-all group"
                    >
                        <Activity size={32} className="mb-3 text-slate-700 group-hover:text-slate-600 transition-colors" />
                        <span className="text-sm text-slate-500 font-medium group-hover:text-slate-400">No active signals</span>
                        <span className="text-[10px] text-slate-600 mt-1">Click to search history</span>
                    </div>
                ) : (
                    events.map((e, idx) => (
                        <DeviceCard
                            key={idx}
                            event={e}
                            idx={idx}
                            onQuery={onQuery}
                            room={currentRoom}
                            onClose={onClose}
                        />
                    ))
                )}
            </div>

            {/* System Status Footer */}
            <div
                className="p-6 border-t border-slate-800/60 bg-[#0b0d14]/80 cursor-pointer group hover:bg-[#151923] transition-colors"
                onClick={() => { onQuery("Run a full system integrity check and report status."); onClose(); }}
            >
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-3 group-hover:text-blue-400 transition-colors">
                    <span>System Integrity</span>
                    <span className="text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        100%
                    </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-500 w-full h-full rounded-full opacity-80"></div>
                </div>
            </div>
        </motion.div>
    );
};

const DeviceCard = ({ event, idx, onQuery, room, onClose }) => {
    const isOn = String(event.status).toLowerCase() === 'on' || event.status > 0;

    // Icon Selection
    let Icon = Activity;
    if (event.device_type.toLowerCase().includes('tv')) Icon = Monitor;
    if (event.device_type.toLowerCase().includes('light')) Icon = Zap;
    if (event.device_type.toLowerCase().includes('temp')) Icon = Thermometer;
    if (event.device_type.toLowerCase().includes('humid')) Icon = Droplets;

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onQuery) {
            const queryText = `What is the current status of the ${event.device_type} in ${room}?`;
            onQuery(queryText);
            if (onClose) onClose();
        }
    };

    return (
        <div
            onClick={handleClick}
            className="w-full text-left group relative bg-[#151923] border border-slate-800/80 p-4 rounded-xl hover:border-blue-500/40 hover:bg-[#1a202e] transition-all overflow-hidden shadow-sm hover:shadow-md cursor-pointer mb-3 z-50"
        >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isOn ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                            {event.device_type}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {event.timestamp.split(' ')[1]}
                        </div>
                    </div>
                </div>
                <div className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide border ${isOn ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                    {isOn ? 'ACTIVE' : 'IDLE'}
                </div>
            </div>

            <div className="mt-4 flex items-end justify-between relative z-10 border-t border-slate-800/50 pt-3">
                <span className="text-[10px] text-slate-500 font-medium">Sensor Reading</span>
                <span className="text-sm font-mono font-bold text-slate-200 group-hover:text-white">
                    {renderValue(event)}
                </span>
            </div>
        </div>
    );
};

function renderValue(e) {
    if (e.temperature) return `${e.temperature}°C`;
    if (e.humidity) return `${e.humidity}%`;
    if (e.brightness) return `${e.brightness}%`;
    if (e.energy_consumption) return `${e.energy_consumption} kWh`;

    if (e.value && e.value !== 'null') {
        if (!isNaN(e.value) && e.value.toString().includes('.')) return parseFloat(e.value).toFixed(1);
        return e.value;
    }

    // Fallback if status works as value (e.g. string status)
    if (e.status && e.status !== "N/A") return e.status;

    return "No Data";
}

export default Sidebar;
