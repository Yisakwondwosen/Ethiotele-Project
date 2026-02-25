import React from 'react';
import { FaHome, FaWallet, FaChartPie, FaUser, FaPlus } from 'react-icons/fa';

const BottomNav = ({ activeTab, setActiveTab, onFabClick }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/60 shadow-2xl border-t border-[#222] backdrop-blur-[12px] px-8 py-3 pb-8 flex justify-between items-center z-50">
            {/* Home */}
            <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'home' ? 'text-brand-orange' : 'text-gray-300'}`}
            >
                <FaHome size={22} />
            </button>

            {/* Wallet */}
            <button
                onClick={() => setActiveTab('wallet')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'wallet' ? 'text-brand-orange' : 'text-gray-300'}`}
            >
                <FaWallet size={22} />
            </button>

            {/* FAB - Centered */}
            <div className="relative -top-6">
                <button
                    onClick={onFabClick}
                    className="w-14 h-14 bg-brand-orange rounded-full text-white flex items-center justify-center shadow-glow-orange transform active:scale-95 transition-all"
                >
                    <FaPlus size={20} />
                </button>
            </div>

            {/* Analytics */}
            <button
                onClick={() => setActiveTab('analytics')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'analytics' ? 'text-brand-orange' : 'text-gray-300'}`}
            >
                <FaChartPie size={22} />
            </button>

            {/* Profile */}
            <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center space-y-1 ${activeTab === 'profile' ? 'text-brand-orange' : 'text-gray-300'}`}
            >
                <FaUser size={22} />
            </button>
        </div>
    );
};

export default BottomNav;
