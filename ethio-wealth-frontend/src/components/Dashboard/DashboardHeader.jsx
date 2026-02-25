import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function DashboardHeader({ balance, walletBalance = 0, trend = '+4.2%', isPrivacyVisible, onTogglePrivacy, t }) {
    const formattedBalance = Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedWallet = Number(walletBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const [integerPart, decimalPart] = formattedBalance.split('.');
    const [walletInt, walletDec] = formattedWallet.split('.');

    // Determine the trend style
    const isPositiveTrend = trend.startsWith('+');
    const trendClass = isPositiveTrend ? 'text-[#10B981] bg-[#10B981]/10' : 'text-[#EF4444] bg-[#EF4444]/10';

    return (
        <div
            className="w-full flex flex-col items-center justify-center pt-8 pb-6 md:pt-12 md:pb-8 relative"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 24px) + 24px)' }}
        >
            {/* Context/Title */}
            <div className="flex items-center space-x-2 mb-3">
                <span className="text-[#A1A1AA] text-xs font-mono tracking-widest uppercase">
                    {t ? t('total_balance') : 'Total Wealth'}
                </span>
                <button
                    onClick={onTogglePrivacy}
                    className="text-[#A1A1AA] hover:text-white transition-colors"
                    aria-label="Toggle Privacy"
                >
                    {isPrivacyVisible ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
            </div>

            {/* Global Header Balance */}
            <div className="flex items-baseline space-x-1 sm:space-x-2 relative group">
                {isPrivacyVisible ? (
                    <h1 className="flex items-baseline font-sans text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
                        <span className="font-mono text-[0.75em] text-[#A1A1AA] mr-2">ETB</span>
                        {integerPart}
                        <span className="font-mono text-[0.75em] text-[#A1A1AA]">.{decimalPart}</span>
                    </h1>
                ) : (
                    <h1 className="flex items-baseline font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-widest blur-[4px] opacity-80 select-none">
                        ETB ****.**
                    </h1>
                )}

                {/* Trend Indicator */}
                {!isPrivacyVisible ? null : (
                    <div className="absolute top-0 right-[-3rem] sm:right-[-4rem] transform -translate-y-1/2">
                        <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-mono font-bold ${trendClass}`}>
                            {trend}
                        </span>
                    </div>
                )}
            </div>

            {/* In-App Wallet Balance */}
            <div className="mt-6 flex flex-col items-center">
                <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase mb-1">
                    Telebirr Wallet (In-App)
                </span>
                {isPrivacyVisible ? (
                    <div className="bg-[#121212] border border-[#333] px-4 py-1.5 rounded-full flex items-center space-x-2">
                        <span className="font-mono text-xs text-brand-purple">ETB</span>
                        <span className="font-sans text-sm font-bold text-white">{walletInt}.{walletDec}</span>
                    </div>
                ) : (
                    <div className="bg-[#121212] border border-[#333] px-4 py-1.5 rounded-full blur-[3px]">
                        <span className="font-mono text-xs text-zinc-500">ETB **.**</span>
                    </div>
                )}
            </div>
        </div>
    );
}
