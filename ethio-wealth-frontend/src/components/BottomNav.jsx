import React from 'react';
import {
    PiHouse, PiHouseFill,
    PiWallet, PiWalletFill,
    PiChartPieSlice, PiChartPieSliceFill,
    PiUser, PiUserFill,
    PiPlusBold
} from 'react-icons/pi';
import { motion } from 'framer-motion';

const BottomNav = ({ activeTab, setActiveTab, onFabClick }) => {
    const activeColor = "text-[#EE6B5E]";
    const inactiveColor = "text-[#71717A]";

    const navItems = [
        { id: 'home', Outline: PiHouse, Filled: PiHouseFill },
        { id: 'wallet', Outline: PiWallet, Filled: PiWalletFill },
        { id: 'fab', isFab: true },
        { id: 'analytics', Outline: PiChartPieSlice, Filled: PiChartPieSliceFill },
        { id: 'profile', Outline: PiUser, Filled: PiUserFill }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-6 px-4 md:px-0 flex justify-center">
            {/* Floating Glassmorphic Container centered on Mobile */}
            <div className="w-full max-w-[360px] bg-[#121212]/90 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/5 rounded-[32px] px-6 py-4 flex justify-between items-center pointer-events-auto">
                {navItems.map((item) => {
                    if (item.isFab) {
                        return (
                            <div key="fab" className="relative -top-8 px-2 flex justify-center">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onFabClick}
                                    className="w-14 h-14 bg-[#EE6B5E] rounded-full text-white flex items-center justify-center shadow-[0_8px_20px_rgba(238,107,94,0.3)] border-[4px] border-[#121212]"
                                >
                                    <PiPlusBold size={24} />
                                </motion.button>
                            </div>
                        );
                    }

                    const isActive = activeTab === item.id;
                    const Icon = isActive ? item.Filled : item.Outline;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id)}
                            className="relative flex flex-col items-center justify-center w-12 h-12"
                        >
                            {/* Animated Pill Background */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute inset-0 bg-[#EE6B5E]/10 rounded-[20px]"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}

                            <motion.div
                                initial={false}
                                animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.05 : 1 }}
                                className={`relative z-10 transition-colors duration-300 ${isActive ? activeColor : inactiveColor}`}
                            >
                                <Icon size={24} />
                            </motion.div>

                            {/* Notification Dot indicator (Optional aesthetic) */}
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-dot"
                                    className="absolute bottom-1 w-1 h-1 bg-[#EE6B5E] rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
