import React, { useState } from 'react';
import { FaRobot, FaLightbulb, FaLock, FaCheckCircle } from 'react-icons/fa';
import { payForAiInsights, generateAiInsights } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIRecommendations({ summaryData, onPaymentSuccess }) {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aiLanguage, setAiLanguage] = useState('en');
    const [hasGenerated, setHasGenerated] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);

    // New UCD Payment States
    const [showPaymentUI, setShowPaymentUI] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const generateGeminiInsights = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const dataString = JSON.stringify({
                income: summaryData.totalIncome,
                expense: summaryData.totalExpense,
                balance: summaryData.currentBalance,
                categories: summaryData.categorization?.slice(0, 3) || [],
                trends: summaryData.monthlyTrends || []
            });

            const langInstruction = aiLanguage === 'am'
                ? "Write the 3 recommendations in fluent Amharic."
                : "Write the 3 recommendations in English.";

            const prompt = `You are a highly analytical, strict financial AI. Analyze this user's financial summary: ${dataString}. Provide exactly 3 short, actionable, and brutal financial recommendations to improve their wealth. ${langInstruction} Your response MUST be a raw JSON array of exactly 3 strings. Example format: ["string1", "string2", "string3"]. Do NOT include markdown backticks or the word 'json'. Just return the array.`;

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const response = await generateAiInsights(prompt, apiKey);

            const rawText = response.candidates[0].content.parts[0].text;
            const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            const jsonArr = JSON.parse(cleanText);

            if (Array.isArray(jsonArr) && jsonArr.length > 0) {
                setRecommendations(jsonArr);
                setHasGenerated(true);
            } else {
                throw new Error("Invalid format");
            }
        } catch (err) {
            console.error("Gemini AI Error:", err);
            setError("AI Engine temporarily offline or rate limited.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateClick = () => {
        if (!summaryData || !summaryData.currentBalance) return;

        if (hasGenerated && !hasPaid) {
            setShowPaymentUI(true);
        } else {
            generateGeminiInsights();
        }
    };

    const handlePayment = async () => {
        setIsPaying(true);
        setError(null);
        try {
            await payForAiInsights();
            setHasPaid(true);
            setShowPaymentUI(false);
            if (onPaymentSuccess) onPaymentSuccess();
            generateGeminiInsights(); // Auto-regenerate post payment
        } catch (err) {
            setError(err.response?.data?.error || "Payment failed. Insufficient funds in Telebirr wallet.");
        } finally {
            setIsPaying(false);
        }
    };

    if (!summaryData || !summaryData.currentBalance) {
        return null;
    }

    return (
        <div className="bg-[#121212] border border-[#222] rounded-[16px] p-6 mb-8 relative overflow-hidden group">
            {/* Ambient AI Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-purple rounded-full filter blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3 z-10 relative">
                <div className="flex items-center space-x-3">
                    <FaRobot className="text-[#A1A1AA]" size={18} />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center">
                        SantimSentryAI Insights <FaLightbulb className="ml-2 text-yellow-500 opacity-80" size={12} />
                    </h3>
                </div>

                <select
                    value={aiLanguage}
                    onChange={(e) => setAiLanguage(e.target.value)}
                    className="bg-black/50 border border-[#333] text-[#A1A1AA] text-xs font-mono rounded-[8px] px-2 py-1 outline-none hover:text-white transition-colors cursor-pointer"
                >
                    <option value="en">ENG</option>
                    <option value="am">አማርኛ</option>
                </select>
            </div>

            {isLoading ? (
                <div className="space-y-3 animate-pulse mt-4">
                    <div className="h-4 bg-[#222] rounded w-full"></div>
                    <div className="h-4 bg-[#222] rounded w-5/6"></div>
                    <div className="h-4 bg-[#222] rounded w-4/6"></div>
                </div>
            ) : error && !showPaymentUI ? (
                <div className="mt-4">
                    <p className="text-xs font-mono text-[#EF4444] mb-4">{error}</p>
                    <button onClick={handleGenerateClick} className="text-xs font-bold font-mono text-black bg-white px-4 py-2 rounded">
                        Try Again
                    </button>
                </div>
            ) : recommendations.length === 0 ? (
                <div className="text-center mt-6">
                    <p className="text-[#A1A1AA] text-sm mb-4">Click below to generate personalized, AI-driven financial insights.</p>
                    <button
                        onClick={handleGenerateClick}
                        className="bg-brand-purple hover:bg-brand-orange transition-colors text-white text-xs font-bold font-mono uppercase tracking-widest px-6 py-3 rounded-[8px]"
                    >
                        Generate Insights
                    </button>
                </div>
            ) : (
                <div className="space-y-3 mt-4 relative">
                    {recommendations.map((rec, idx) => (
                        <div key={idx} className={`flex items-start space-x-3 p-3 rounded-[8px] border transition-all ${idx === 0 || hasPaid ? 'bg-black/50 border-[#333]' : 'bg-black/20 border-[#222] opacity-40 blur-[1px]'}`}>
                            <span className="text-brand-purple font-mono text-xs font-bold mt-0.5">0{idx + 1}</span>
                            <p className="text-sm font-sans text-gray-300 leading-relaxed">
                                {idx === 0 || hasPaid ? rec : "Premium insight locked. Upgrade to reveal deep financial analysis patterns and advanced metrics."}
                            </p>
                            {idx !== 0 && !hasPaid && (
                                <FaLock className="text-zinc-600 mt-1 flex-shrink-0" size={12} />
                            )}
                        </div>
                    ))}

                    {/* UCD Payment UI / Action Button */}
                    <AnimatePresence mode="wait">
                        {showPaymentUI ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="mt-6 p-5 bg-[#0A0A0A] border border-brand-purple/30 rounded-xl text-center shadow-[0_0_30px_rgba(139,92,246,0.1)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-orange to-brand-purple"></div>
                                <h4 className="text-white text-sm font-bold mb-2 flex justify-center items-center gap-2">
                                    <FaCheckCircle className="text-brand-orange" />
                                    Unlock Unlimited AI Insights
                                </h4>
                                <p className="text-[#A1A1AA] text-xs mb-5">A one-time fee of 50 ETB will be securely deducted from your Telebirr wallet.</p>

                                {error && <p className="text-[#EF4444] text-xs mb-4">{error}</p>}

                                <div className="flex space-x-3 justify-center">
                                    <button
                                        onClick={() => { setShowPaymentUI(false); setError(null); }}
                                        className="px-5 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={isPaying}
                                        className="px-5 py-2.5 bg-brand-orange hover:bg-[#D95B4E] text-white rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(238,107,94,0.3)] transition-all flex items-center justify-center min-w-[140px] border border-[#EE6B5E]"
                                    >
                                        {isPaying ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : "Pay 50 ETB"}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="mt-5 text-center">
                                <button
                                    onClick={handleGenerateClick}
                                    className={`text-xs font-bold font-mono uppercase tracking-widest px-6 py-3 rounded-lg transition-all border ${!hasGenerated || hasPaid ? 'bg-black hover:bg-[#222] text-zinc-300 border-[#333]' : 'bg-[#EE6B5E]/10 hover:bg-[#EE6B5E]/20 text-[#EE6B5E] border-[#EE6B5E]/30 shadow-[0_0_10px_rgba(238,107,94,0.1)] hover:shadow-[0_0_15px_rgba(238,107,94,0.2)]'}`}
                                >
                                    {!hasGenerated || hasPaid ? "Regenerate Analysis" : "Unlock Pro Insights"}
                                </button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
