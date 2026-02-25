import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://yisehak.duckdns.org/api/auth/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-zinc-100">
            {/* Split Background Effect */}
            <div className="absolute inset-0 z-0 flex flex-col">
                <div className="flex-1 bg-[#000000]"></div>
                <div className="flex-1 bg-[#8B5CF6]/10"></div>
            </div>

            {/* Ambient Overlays */}
            <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

            <div className="bg-[#09090B] p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 relative z-10 my-10">
                <div className="text-center mb-8">
                    <div className="mb-2 flex justify-center">
                        <span className="text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: '"Outfit", sans-serif' }}>SANTIM SENTRY</span>
                    </div>
                </div>

                {/* Toggle Component */}
                <div className="flex bg-black border border-white/10 rounded-full p-1 mb-8">
                    <Link to="/login" className="flex-1 text-center py-2.5 rounded-full text-zinc-400 font-medium hover:text-white transition">
                        Login
                    </Link>
                    <div className="flex-1 text-center py-2.5 rounded-full bg-gradient-to-r from-brand-purple to-indigo-600 text-white font-bold shadow-lg">
                        Signup
                    </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-center text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            required
                            placeholder="Full Name"
                            className="w-full px-4 py-3.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple transition-colors"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            className="w-full px-4 py-3.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full px-4 py-3.5 rounded-xl bg-transparent border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-purple transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-brand-purple to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                        >
                            Signup
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-400">
                    Already a member? <Link to="/login" className="text-brand-purple font-medium hover:text-white transition">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
