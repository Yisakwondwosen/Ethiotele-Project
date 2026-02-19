import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaCoins } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className="flex justify-between items-center py-6 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
                    <span className="text-xl font-bold tracking-tight text-brand-dark">Santim Sentry</span>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-brand-purple transition">Login</Link>
                    <Link to="/signup" className="px-5 py-2.5 bg-brand-purple text-white text-sm font-bold rounded-xl shadow-glow hover:opacity-90 transition transform hover:-translate-y-0.5">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 z-10">
                    <div className="inline-block px-4 py-1.5 bg-brand-orange bg-opacity-10 text-brand-orange text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                        Finance for Ethiopia 🇪🇹
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-brand-dark leading-tight mb-6">
                        Even 1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Santim</span> Matters.
                    </h1>
                    <p className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
                        Track your daily expenses, analyze your spending habits, and secure your financial future with Santim Sentry.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <Link to="/signup" className="px-8 py-4 bg-brand-dark text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-900 transition flex items-center justify-center">
                            Start Tracking Free
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white text-brand-dark font-bold rounded-2xl border border-gray-100 shadow-sm hover:border-gray-300 transition flex items-center justify-center">
                            Live Demo
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400"></div>
                        </div>
                        <span>Join 2,000+ Ethiopians today.</span>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="md:w-1/2 relative mt-16 md:mt-0 flex justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-brand-purple to-brand-orange rounded-full opacity-20 blur-3xl animate-pulse"></div>
                    <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl border-4 border-gray-50 transform md:rotate-[-2deg] hover:rotate-0 transition duration-500 w-full max-w-md">
                        {/* Mock App Interface in CSS */}
                        <div className="bg-gray-50 rounded-2xl p-4 h-[300px] flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="w-8 h-8 bg-brand-purple rounded-lg"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="bg-brand-dark rounded-xl h-32 w-full relative overflow-hidden p-4 text-white">
                                <p className="text-xs opacity-50">Total Balance</p>
                                <p className="text-2xl font-bold">ETB 24,500</p>
                                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-brand-orange rounded-full opacity-20"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-12 bg-white rounded-xl shadow-sm flex items-center p-2 space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg"></div>
                                    <div className="flex-1 h-2 bg-gray-100 rounded"></div>
                                </div>
                                <div className="h-12 bg-white rounded-xl shadow-sm flex items-center p-2 space-x-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg"></div>
                                    <div className="flex-1 h-2 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Floating Badge */}
                    <div className="absolute bottom-10 -left-4 md:-left-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center space-x-3 animate-bounce">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <FaCoins />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Total Savings</p>
                            <p className="font-bold text-brand-dark">ETB 45,000</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-brand-dark mb-4">Why Santim Sentry?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Because every single coin counts towards your wealth. We provide the tools to make sure you never lose track.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <FaChartLine className="text-brand-purple" />, title: "Smart Analytics", desc: "Visualize your spending with beautiful charts." },
                            { icon: <FaShieldAlt className="text-brand-orange" />, title: "Bank-Grade Security", desc: "Your financial data is encrypted and secure." },
                            { icon: <FaCoins className="text-green-500" />, title: "Expense Tracking", desc: "Categorize every transaction effortlessly." }
                        ].map((f, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100 group">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
                        <span className="font-bold text-brand-dark">Santim Sentry</span>
                    </div>
                    <div className="text-sm text-gray-400">
                        &copy; 2026 Santim Sentry. Built with ❤️ in Addis Ababa.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
