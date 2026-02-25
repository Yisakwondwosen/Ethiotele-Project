import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function QuickActions({ onTopup }) {
    return (
        <div className="my-6 md:my-8 px-2 sm:px-4 max-w-2xl mx-auto w-full">
            {/* Topup - Main CTA */}
            <button
                onClick={onTopup}
                className="group w-full flex flex-row space-x-2 items-center justify-center py-4 rounded-[8px] bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all active:scale-95 border border-white"
                aria-label="Topup"
            >
                <FaPlus className="text-black font-bold" size={16} />
                <span className="text-sm font-sans font-extrabold text-black uppercase tracking-wider">Topup</span>
            </button>
        </div>
    );
}
