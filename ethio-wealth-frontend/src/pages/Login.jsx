import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import VerifiedSignIn from '../components/VerifiedSignIn';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4 relative overflow-hidden text-zinc-100">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="bg-[#09090B] p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <div className="mb-6 flex justify-center">
                        <span className="text-2xl font-extrabold tracking-tight text-white" style={{ fontFamily: '"Outfit", sans-serif' }}>SANTIM SENTRY</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{t('login')}</h1>
                    <p className="text-zinc-500">{t('welcome')}</p>
                </div>

                <div className="mb-8">
                    <VerifiedSignIn />
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs uppercase font-bold">Or Email</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">{t('email')}</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-zinc-400">{t('password')}</label>
                            <a href="#" className="text-xs text-brand-purple hover:text-white transition">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-white transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl shadow-lg hover:bg-zinc-200 transition-colors"
                    >
                        {t('submit')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-zinc-500 text-sm">
                        {t('dont_have_account')} <Link to="/signup" className="text-white font-bold hover:underline transition">{t('signup')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
