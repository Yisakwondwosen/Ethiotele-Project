import React from 'react';
import { FaTwitter, FaLinkedin, FaTelegram, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="text-2xl tracking-tighter text-white" style={{ fontFamily: '"Permanent Marker", cursive' }}>SANTIM SENTRY</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
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
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><FooterLink to="/features">Features</FooterLink></li>
                            <li><FooterLink to="/pricing">Pricing</FooterLink></li>
                            <li><FooterLink to="/integrations">Integrations</FooterLink></li>
                            <li><FooterLink to="/roadmap">Roadmap</FooterLink></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><FooterLink to="/about">About Us</FooterLink></li>
                            <li><FooterLink to="/careers">Careers</FooterLink></li>
                            <li><FooterLink to="/blog">Blog</FooterLink></li>
                            <li><FooterLink to="/contact">Contact</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter / Legal */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Stay Verified</h4>
                        <p className="text-gray-400 text-xs mb-4">
                            Get the latest financial tips and security updates.
                        </p>
                        <form className="flex mb-6">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="bg-gray-800 border-none text-white text-sm rounded-l-lg px-4 py-2 w-full focus:ring-2 focus:ring-brand-purple focus:outline-none"
                            />
                            <button className="bg-brand-purple text-white text-sm font-bold px-4 py-2 rounded-r-lg hover:bg-opacity-90 transition">
                                Join
                            </button>
                        </form>
                        <div className="flex flex-col space-y-2 text-xs text-gray-500">
                            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-gray-500 mb-4 md:mb-0">
                        &copy; 2026 Santim Sentry. Made with ☕ in Addis Ababa using <span className="text-green-500">Fayda ID</span>.
                    </p>
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Systems Operational</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a href={href} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-brand-purple hover:text-white transition duration-300">
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <Link to={to} className="hover:text-brand-orange transition duration-200 block">
        {children}
    </Link>
);

export default Footer;
