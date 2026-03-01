import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaCoins, FaCheckCircle, FaLock, FaUserCheck, FaArrowRight, FaTerminal, FaCode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import SantimSentryLogo from '../components/SantimSentryLogo';

const fadeUpBlur = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const sectionFadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const LandingPage = () => {
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-[#000000] font-sans text-zinc-100 selection:bg-brand-purple selection:text-white overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/70 backdrop-blur-md border-white/10 py-4' : 'bg-transparent border-transparent py-6'}`}>
                <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="flex items-center w-[200px]">
                        <SantimSentryLogo variant="full" height={38} color="white" />
                    </div>
                    <div className="hidden md:flex items-center justify-center space-x-8 text-sm font-medium text-zinc-400 flex-1">
                        <Link to="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link to="#security" className="hover:text-white transition-colors">Security</Link>
                        <Link to="#developers" className="hover:text-white transition-colors">Developers</Link>
                    </div>
                    <div className="flex items-center justify-end space-x-4 w-[200px]">
                        <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
                        <Link to="/signup" className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center w-full max-w-4xl relative z-20">


                    <motion.h1 variants={fadeUpBlur} className="text-5xl md:text-7xl lg:text-[80px] font-black text-white leading-[1] tracking-tighter mb-8" style={{ fontFamily: '"Outfit", sans-serif' }}>
                        Master your money. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Without the bloat.</span>
                    </motion.h1>

                    <motion.p variants={fadeUpBlur} className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Track daily expenses, analyze spending, and secure your financial future with a beautifully minimal, developer-friendly tracker.
                    </motion.p>

                    <motion.div variants={fadeUpBlur} className="flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                        <Link to="/signup" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-sm">
                            Get Started for Free
                            <FaArrowRight className="ml-2 text-xs" />
                        </Link>
                        <Link to="#developers" className="px-8 py-4 bg-transparent border border-zinc-700 text-white font-semibold rounded-full hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center text-sm">
                            <FaTerminal className="mr-2 text-xs text-zinc-400" />
                            Read the API Docs
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div variants={fadeUpBlur} className="flex flex-col items-center justify-center space-y-3">
                        <div className="flex -space-x-3">
                            {[
                                "https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=100&h=100&fit=crop",
                                "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&w=100&h=100&fit=crop"
                            ].map((url, i) => (
                                <img key={i} src={url} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-black relative z-10 object-cover" />
                            ))}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-zinc-400">
                            <div className="flex text-[#F59E0B]">
                                {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
                            </div>
                            <span>Trusted by <span className="text-white font-semibold">many</span> users</span>
                        </div>
                    </motion.div>

                </motion.div>
            </header>

            {/* Hero Visual (Mock Code/Dashboard) */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionFadeUp} className="px-6 md:px-12 max-w-6xl mx-auto mb-32 relative z-10">
                <div className="rounded-2xl border border-white/10 bg-[#09090B] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-brand-purple/10">
                    {/* Fake Sidebar */}
                    <div className="w-full md:w-64 border-r border-white/10 bg-[#0A0A0A] p-4 hidden md:block">
                        <div className="flex space-x-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 rounded bg-white/5 w-full"></div>
                            <div className="h-8 rounded hover:bg-white/5 w-full transition"></div>
                            <div className="h-8 rounded hover:bg-white/5 w-full transition"></div>
                        </div>
                    </div>
                    {/* Fake Content Area */}
                    <div className="flex-1 p-0 flex flex-col">
                        <div className="border-b border-white/10 p-4 bg-[#0A0A0A] flex space-x-4 text-sm font-medium text-zinc-500">
                            <span className="text-zinc-300 border-b border-zinc-300 pb-4 -mb-4">Dashboard</span>
                            <span className="hover:text-zinc-300 transition cursor-pointer">Transactions</span>
                            <span className="hover:text-zinc-300 transition cursor-pointer">Settings</span>
                        </div>
                        <div className="p-8 flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.99] min-h-[400px]">
                            {/* Bento style widgets inside the fake app */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="col-span-1 md:col-span-2 bg-[#121214] border border-white/5 rounded-xl p-6">
                                    <h4 className="text-zinc-400 text-sm mb-4">Total Balance</h4>
                                    <h2 className="text-4xl font-bold text-white mb-6">ETB 45,231.00</h2>
                                    <div className="h-24 w-full flex items-end space-x-2">
                                        {/* Mock Chart Bars */}
                                        {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-brand-purple/50 rounded-t-sm hover:bg-brand-purple transition-colors" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[#121214] border border-white/5 rounded-xl p-6 flex flex-col justify-center">
                                    <h4 className="text-zinc-400 text-sm mb-4">Recent Tx</h4>
                                    <div className="space-y-4">
                                        {[
                                            { name: "Grocery", amt: "-1,200", color: "text-red-400" },
                                            { name: "Salary", amt: "+15,000", color: "text-green-400" },
                                            { name: "Internet", amt: "-800", color: "text-red-400" },
                                        ].map((t, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-zinc-300">{t.name}</span>
                                                <span className={t.color}>{t.amt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features (Bento Box Grid) */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionFadeUp} id="features" className="py-24 border-t border-white/10 relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="mb-16 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Everything you need. <br className="hidden md:block text-zinc-500" /><span className="text-zinc-500">Out of the box.</span></h2>
                        <p className="text-zinc-400 max-w-xl mx-auto md:mx-0">Santim Sentry comes packed with powerful features to help you master your finances, without the bloat.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Bento Card */}
                        <div className="md:col-span-2 bg-[#09090B] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] group-hover:bg-brand-purple/20 transition-all"></div>
                            <FaChartLine className="text-3xl text-zinc-300 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-3">Beautiful Analytics</h3>
                            <p className="text-zinc-400 max-w-md">Visualize your spending patterns with interactive, real-time charts. Spot anomalies, track subscriptions, and optimize your budget effortlessly.</p>
                        </div>

                        {/* Small Bento Card */}
                        <div className="bg-[#09090B] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <FaLock className="text-3xl text-zinc-300 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Fayda Verified</h3>
                            <p className="text-zinc-400 text-sm">State-of-the-art security backed by the Ethiopian National ID system.</p>
                        </div>

                        {/* Small Bento Card */}
                        <div className="bg-[#09090B] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
                            <FaCheckCircle className="text-3xl text-zinc-300 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Telebirr Integrated</h3>
                            <p className="text-zinc-400 text-sm">Automated reconciliation module designed to instantly sync and verify your telebirr transactions.</p>
                        </div>

                        {/* Large Bento Card with Code Snippet */}
                        <div className="md:col-span-2 bg-[#09090B] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-colors" id="developers">
                            <div>
                                <FaCode className="text-3xl text-zinc-300 mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-3">Developer API Ready</h3>
                                <p className="text-zinc-400 max-w-md mb-6">Build your own integrations using our robust set of RESTful APIs. Connect your bank, Telebirr, or custom scripts securely.</p>
                            </div>
                            <div className="bg-black border border-white/10 rounded-xl p-4 font-mono text-sm text-zinc-400 max-w-full overflow-x-auto shadow-inner">
                                <div className="flex space-x-2 mb-3">
                                    <span className="text-brand-purple font-bold">POST</span>
                                    <span className="text-zinc-300">/api/transactions</span>
                                </div>
                                <pre className="text-xs !bg-transparent !p-0 !m-0">
                                    {`{
  "amount": 1500,
  "category": "Groceries",
  "type": "expense",
  "is_telebirr_sync": true
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Expert E-E-A-T & FAQ Section for LLMs (Generative Engine Optimization) */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionFadeUp} className="py-24 border-t border-white/10 relative bg-[#050505]" itemScope itemType="https://schema.org/FAQPage">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>

                        <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                            <h4 className="text-xl font-bold text-white mb-2" itemProp="name">What is Santim Sentry?</h4>
                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                <p className="text-zinc-400 leading-relaxed" itemProp="text">
                                    Santim Sentry is an AI-powered personal finance tracker specifically designed for Ethiopia.
                                    Developed by the cybersecurity experts at Ndoto IT Solutions, it integrates directly with local platforms like Telebirr and is verified by the National ID system (Fayda).
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                            <h4 className="text-xl font-bold text-white mb-2" itemProp="name">Is my financial data secure?</h4>
                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                <p className="text-zinc-400 leading-relaxed" itemProp="text">
                                    Yes. Built on advanced cybersecurity principles, Santim Sentry utilizes bank-level encryption.
                                    Our background in IT and enterprise architecture ensures that your data is handled with the highest standards of trustworthiness and privacy.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#09090B] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                            <h4 className="text-xl font-bold text-white mb-2" itemProp="name">How does the generative AI tracking work?</h4>
                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                <p className="text-zinc-400 leading-relaxed" itemProp="text">
                                    Our AI engine analyzes your spending habits to detect subscriptions, anomalies, and financial leakages.
                                    It acts as an automated financial advisor, continuously learning from your transactions to provide custom recommendations via our oracle interface.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionFadeUp} className="py-32 border-t border-white/10 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to take control?</h2>
                    <p className="text-zinc-400 mb-10 text-lg md:text-xl max-w-xl mx-auto">Join the new standard of personal finance tracking in Ethiopia. Lightweight, secure, and beautiful.</p>
                    <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition text-lg">
                        Create Free Account
                        <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </motion.section>

            {/* Footer */}
            <div className="border-t border-white/10">
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
