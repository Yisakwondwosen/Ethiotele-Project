import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import VerifiedSignIn from '../components/VerifiedSignIn';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isGuestMode, setIsGuestMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');
    const [errors, setErrors] = useState({});

    const { login, guestLogin } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const savedEmail = localStorage.getItem('lastEmail');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const validate = () => {
        const newErrors = {};
        if (isGuestMode) {
            if (!username.trim()) newErrors.username = "Username required";
            else if (username.length < 3) newErrors.username = "Min 3 characters";
        } else {
            if (!email) newErrors.email = "Email required";
            if (!password) newErrors.password = "Password required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError('');
        if (!validate()) return;

        setLoading(true);
        try {
            if (isGuestMode) {
                await guestLogin(username);
            } else {
                localStorage.setItem('lastEmail', email);
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err) {
            setGlobalError(isGuestMode ? 'Guest login failed.' : 'Invalid credentials.');
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
                    <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center mx-auto mb-6 text-xl font-bold tracking-tighter" style={{ fontFamily: '"Outfit", sans-serif' }}>SS</div>
                    </Link>
                    <h1 className="text-[28px] font-semibold tracking-tight text-white mb-2 leading-tight">Sign in to Santim</h1>
                    <p className="text-[#86868B] text-[15px]">Welcome back. Please enter your details.</p>
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
                                    className="absolute inset-0 border-2 border-white rounded-full border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-white text-[15px] font-medium tracking-tight mb-1">Authenticating</p>
                                <p className="text-[#86868B] text-[13px]">Establishing secure tunnel...</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Verified Sign In */}
                            <div className="mb-6">
                                <VerifiedSignIn />
                                <div className="relative flex py-6 items-center">
                                    <div className="flex-grow border-t border-[#333336]"></div>
                                    <span className="flex-shrink-0 mx-4 text-[#86868B] text-[13px] font-medium">or continue with</span>
                                    <div className="flex-grow border-t border-[#333336]"></div>
                                </div>
                            </div>

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
                                {isGuestMode ? (
                                    <div>
                                        <label className="block text-[13px] text-[#86868B] mb-2 font-medium">Username</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3.5 bg-[#1C1C1E] border border-[#333336] rounded-xl text-white placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-[15px]"
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                if (errors.username) setErrors({ ...errors, username: null });
                                            }}
                                            placeholder="anon_user"
                                        />
                                        {errors.username && <p className="text-red-500 text-[12px] mt-1.5">{errors.username}</p>}
                                    </div>
                                ) : (
                                    <>
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
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-[13px] text-[#86868B] font-medium">Password</label>
                                                <a href="#" className="text-[13px] text-white hover:underline transition-all">Forgot?</a>
                                            </div>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3.5 bg-[#1C1C1E] border border-[#333336] rounded-xl text-white placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all text-[15px]"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if (errors.password) setErrors({ ...errors, password: null });
                                                }}
                                                placeholder="••••••••"
                                            />
                                            {errors.password && <p className="text-red-500 text-[12px] mt-1.5">{errors.password}</p>}
                                        </div>
                                    </>
                                )}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 hover:scale-[0.98] transition-all text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)]"
                                    >
                                        {isGuestMode ? 'Access as Guest' : 'Sign In'}
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-[#333336] text-center space-y-4">
                                <button
                                    onClick={() => {
                                        setIsGuestMode(!isGuestMode);
                                        setErrors({});
                                        setGlobalError('');
                                    }}
                                    className="text-[#86868B] text-[13px] hover:text-white transition-colors block w-full"
                                >
                                    {isGuestMode ? 'Switch to Standard Login' : 'Login Anonymously (Username Only)'}
                                </button>

                                <div className="text-[13px] text-[#86868B]">
                                    Don't have an account? <Link to="/signup" className="text-white font-medium hover:underline">Sign up</Link>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Login;
