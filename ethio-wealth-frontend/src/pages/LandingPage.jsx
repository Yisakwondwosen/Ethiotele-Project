import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaCoins, FaCheckCircle, FaLock, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const LandingPage = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="flex justify-between items-center py-4 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center space-x-2">
                        {/* <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div> */}
                        <span className="text-2xl tracking-tighter text-brand-dark" style={{ fontFamily: '"Permanent Marker", cursive' }}>SANTIM SENTRY</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
                        <Link to="#features" className="hover:text-brand-purple transition">Features</Link>
                        <Link to="#pricing" className="hover:text-brand-purple transition">Pricing</Link>
                        <Link to="#security" className="hover:text-brand-purple transition">Security</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-brand-purple transition">Login</Link>
                        <Link to="/signup" className="px-6 py-2.5 bg-brand-purple text-white text-sm font-bold rounded-xl shadow-glow hover:opacity-90 transition transform hover:-translate-y-0.5">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 z-10 animate-fade-in-up">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full mb-6 border border-green-100">
                        <FaCheckCircle className="text-green-500" />
                        <span>Verified by National ID (Fayda)</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-brand-dark leading-tight mb-6 tracking-tight">
                        Even 1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500 uppercase">SANTIM</span> Matters.
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
                        Track your daily expenses, analyze your spending habits, and secure your financial future with Santim Sentry.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <Link to="/signup" className="px-8 py-4 bg-brand-dark text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-900 transition flex items-center justify-center group">
                            Start Tracking Free
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white text-brand-dark font-bold rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition flex items-center justify-center">
                            Live Demo
                        </Link>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="md:w-1/2 relative mt-16 md:mt-0 flex justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brand-purple to-brand-orange rounded-full opacity-20 blur-3xl animate-pulse"></div>
                    <div className="relative z-10 w-full max-w-lg">
                        <img
                            src="/assets/dashboard-preview.png"
                            alt="Dashboard Preview"
                            className="rounded-xl shadow-2xl border-4 border-white transform hover:scale-105 transition duration-500 w-full object-cover"
                        />
                        {/* Trust Badge Overlay */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-gray-50 animate-bounce-slow">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <FaShieldAlt size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Security Level</p>
                                <p className="font-bold text-brand-dark text-lg">Bank Grade <span className="text-green-500 text-sm">● Active</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Social Proof / Partners */}
            <section className="py-10 border-y border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted Partners in Security & Payments</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-80 hover:opacity-100 transition-all duration-500">
                        {/* Fayda ID */}
                        <div className="flex items-center space-x-3 group cursor-default">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:border-green-200 transition">
                                <FaUserCheck className="text-green-600 text-2xl" />
                            </div>
                            <span className="text-xl font-bold text-gray-700 tracking-tight">Fayda ID</span>
                        </div>

                        <div className="h-8 w-[1px] bg-gray-300 hidden md:block"></div>

                        {/* Telebirr Logo */}
                        <img
                            src="/assets/telebirr-logo.png"
                            alt="Telebirr"
                            className="h-16 object-contain grayscale hover:grayscale-0 transition duration-300"
                        />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-50"></div>
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-brand-dark mb-4 tracking-tight">Everything you need to <br />master your money.</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">Stop guessing where your money goes. Start tracking, analyzing, and growing your wealth with precision.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <FaChartLine className="text-brand-purple" />, title: "Smart Analytics", desc: "Visualize your spending patterns with beautiful, interactive charts that help you spot leaks in your budget." },
                            { icon: <FaLock className="text-brand-orange" />, title: "Verified Security", desc: "Integrated with Fayda National ID to ensure your account is protected by state-of-the-art identity verification." },
                            { icon: <FaCoins className="text-green-500" />, title: "Automated Tracking", desc: "Categorize every transaction effortlessly. Set budgets and get alerts when you're close to your limits." }
                        ].map((f, i) => (
                            <div key={i} className="bg-gray-50 p-10 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-transparent hover:border-brand-purple/10 group cursor-default">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-brand-dark mb-4">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Micro-CTA / Testimonial */}
            <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-[#0f1020]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="text-5xl text-brand-orange mb-8 opacity-50">"</div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                        "Santim Sentry completely changed how I manage my <span className="text-brand-orange">daily expenses</span>. The integration with Fayda makes it feel incredibly secure."
                    </h2>
                    <div className="flex items-center justify-center space-x-4">
                        <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-12 h-12 rounded-full border-2 border-brand-orange" />
                        <div className="text-left">
                            <p className="font-bold text-white">Sara Tadesse</p>
                            <p className="text-sm text-gray-400">Addis Ababa Resident</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-brand-dark mb-6">Ready to secure your financial future?</h2>
                    <p className="text-gray-500 mb-10 text-lg">Join thousands of Ethiopians who trust Santim Sentry. No credit card required.</p>
                    <Link to="/signup" className="inline-block px-10 py-5 bg-brand-purple text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition text-lg">
                        Create Free Account
                    </Link>
                    <p className="mt-4 text-sm text-gray-400">Trusted by 2,000+ Verified Users</p>
                </div>
            </section>

            {/* Professional Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
