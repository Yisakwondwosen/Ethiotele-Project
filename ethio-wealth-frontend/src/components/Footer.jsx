import React from 'react';
import { FaTwitter, FaLinkedin, FaTelegram, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SantimSentryLogo from './SantimSentryLogo';

const Footer = () => {
    return (
        <footer className="bg-black text-zinc-400 pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-6">
                            <SantimSentryLogo variant="full" height={36} color="white" />
                        </div>
                        <p className="text-sm leading-relaxed mb-6">
                            Empowering Ethiopians to take control of their financial future. Verified security, smart analytics, and effortless tracking.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink href="#" icon={<FaTwitter />} />
                            <SocialLink href="#" icon={<FaLinkedin />} />
                            <SocialLink href="#" icon={<FaTelegram />} />
                            <SocialLink href="#" icon={<FaGithub />} />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink to="#features">Features</FooterLink></li>
                            <li><FooterLink to="#pricing">Pricing</FooterLink></li>
                            <li><FooterLink to="#developers">Developers</FooterLink></li>
                            <li><FooterLink to="/roadmap">Roadmap</FooterLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink to="/docs">Documentation</FooterLink></li>
                            <li><FooterLink to="/api">API Reference</FooterLink></li>
                            <li><FooterLink to="/blog">Blog</FooterLink></li>
                            <li><FooterLink to="/contact">Contact</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter / Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                        <p className="text-xs mb-4">
                            Get the latest financial tips and security updates.
                        </p>
                        <form className="flex mb-6">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-zinc-900 border border-white/10 text-white text-sm rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-white focus:outline-none"
                            />
                            <button className="bg-white text-black text-sm font-bold px-4 py-2 rounded-r-lg hover:bg-zinc-200 transition">
                                Join
                            </button>
                        </form>
                        <div className="flex flex-col space-y-2 text-xs text-zinc-500">
                            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-zinc-500 mb-4 md:mb-0">
                        &copy; 2026 Santim Sentry.
                    </p>
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-glow"></div>
                            <span>All Systems Operational</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a href={href} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white transition-all duration-300">
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <Link to={to} className="hover:text-white transition duration-200 block text-zinc-400">
        {children}
    </Link>
);

export default Footer;
