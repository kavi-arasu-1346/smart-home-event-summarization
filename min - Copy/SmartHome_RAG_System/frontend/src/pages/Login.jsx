import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Mail, Phone, Bell, ArrowRight, Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        push_notifications: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Note: In development mode, the backend might be on localhost:5002
            // Replace with your actual backend URL if different
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register/login');
            }

            // Successfully logged in/registered
            navigate('/chat');
        } catch (err) {
            console.warn("Backend auth failed, switching to demo mode:", err);
            // Seamless fallback for static deployment (Vercel)
            const mockUser = {
                id: 1,
                username: formData.username || (formData.email && formData.email.split('@')[0]) || 'Alex Mercer',
                email: formData.email || 'alex.mercer@univ.edu',
                phone_number: formData.phone_number || '23IT721102'
            };
            localStorage.setItem('user', JSON.stringify(mockUser));
            navigate('/chat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative z-10 mx-4"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Home className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                        Welcome to Cortex
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Enter your details to access the Smart Home hub
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm string text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Username"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-gray-500 outline-none transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Email Address"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-gray-500 outline-none transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-gray-500 outline-none transition-all"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                            <Phone className="w-5 h-5" />
                        </div>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Phone Number (Optional)"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder-gray-500 outline-none transition-all"
                        />
                    </div>

                    <label className="flex items-center space-x-3 cursor-pointer group mt-6 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="push_notifications"
                                checked={formData.push_notifications}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <div className="w-6 h-6 rounded-md border-2 border-gray-500 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-all flex items-center justify-center">
                                <Bell className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                            Enable Push Notifications
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-indigo-400 hover:to-emerald-300 text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        <span>{loading ? 'Processing...' : 'Access Dashboard'}</span>
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/')} 
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Return to Landing Page
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
