import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { registerUser } from '../services/api';
import SantimSentryLogo from '../components/SantimSentryLogo';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { t } = useTranslation();

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Full name required";
        if (!email) newErrors.email = "Email required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid format";
        if (!password) newErrors.password = "Password required";
        else if (password.length < 6) newErrors.password = "Min 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError('');
        if (!validate()) return;

        try {
            await registerUser({ name, email, password });
            localStorage.setItem('lastEmail', email);
            navigate('/login');
        } catch (err) {
            setGlobalError(err.response?.data?.error || 'Signup failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-[#F5F5F7] font-sans selection:bg-white selection:text-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black z-0 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[380px] relative z-10 px-6 sm:px-0"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex flex-col items-center hover:opacity-80 transition-opacity">
                        <div className="mb-5">
                            <SantimSentryLogo variant="icon" height={52} color="white" />
                        </div>
                    </Link>
                    <h1 className="text-[28px] font-semibold tracking-tight text-white mb-2 leading-tight">Create your account</h1>
                    <p className="text-[#86868B] text-[15px]">Setup your Santim vault below.</p>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="py-12 flex flex-col items-center justify-center space-y-8"
                        >
                            <div className="w-12 h-12 relative flex items-center justify-center">
                                <motion.div
                                    className="absolute inset-0 border-2 border-[#333336] rounded-full"
                                />
                                <motion.div
                                    className="absolute inset-0 border-2 border-[#10B981] rounded-full border-t-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-white text-[15px] font-medium tracking-tight mb-1">Provisioning</p>
                                <p className="text-[#86868B] text-[13px]">Configuring secure vault...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Inline Error */}
                            <AnimatePresence>
                                {globalError && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl mb-6 text-center text-[14px] p-3 flex items-center justify-center gap-2 overflow-hidden"
                                    >
                                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>{globalError}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[13px] text-[#86868B] mb-2 font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3.5 bg-[#1C1C1E] border border-[#333336] rounded-xl text-white placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-[15px]"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (errors.name) setErrors({ ...errors, name: null });
                                        }}
                                        placeholder="Yisehak W."
                                    />
                                    {errors.name && <p className="text-red-500 text-[12px] mt-1.5">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[13px] text-[#86868B] mb-2 font-medium">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3.5 bg-[#1C1C1E] border border-[#333336] rounded-xl text-white placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-[15px]"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) setErrors({ ...errors, email: null });
                                        }}
                                        placeholder="name@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-[12px] mt-1.5">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-[13px] text-[#86868B] mb-2 font-medium">Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3.5 bg-[#1C1C1E] border border-[#333336] rounded-xl text-white placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-[15px]"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password) setErrors({ ...errors, password: null });
                                        }}
                                        placeholder="Min 6 characters"
                                    />
                                    {errors.password && <p className="text-red-500 text-[12px] mt-1.5">{errors.password}</p>}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 hover:scale-[0.98] transition-all text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)]"
                                    >
                                        Register
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-[#333336] text-center">
                                <div className="text-[13px] text-[#86868B]">
                                    Already a member? <Link to="/login" className="text-white font-medium hover:underline">Sign in</Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Signup;
