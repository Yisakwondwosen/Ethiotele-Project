import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaLightbulb } from 'react-icons/fa';
import { payForAiInsights } from '../../services/api';

export default function AIRecommendations({ summaryData, onPaymentSuccess }) {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aiLanguage, setAiLanguage] = useState('en');
    const [hasGenerated, setHasGenerated] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);

    const handleGenerateInsights = async () => {
        if (!summaryData || !summaryData.currentBalance) return;

        if (hasGenerated && !hasPaid) {
            const confirmPayment = window.confirm(
                "You have used your free AI insight generation.\n\nSimulate payment of 50 ETB via Telebirr MockAPI to unlock unlimited AI access?"
            );
            if (confirmPayment) {
                try {
                    await payForAiInsights();
                    setHasPaid(true);
                    if (onPaymentSuccess) onPaymentSuccess();
                } catch (err) {
                    alert(err.response?.data?.error || "Payment failed. Please topup your wallet.");
                    return;
                }
            } else {
                return;
            }
        }

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
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.2,
                    }
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const rawText = response.data.candidates[0].content.parts[0].text;
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
            ) : error ? (
                <div className="mt-4">
                    <p className="text-xs font-mono text-[#EF4444] mb-4">{error}</p>
                    <button onClick={handleGenerateInsights} className="text-xs font-bold font-mono text-black bg-white px-4 py-2 rounded">
                        Try Again
                    </button>
                </div>
            ) : recommendations.length === 0 ? (
                <div className="text-center mt-6">
                    <p className="text-[#A1A1AA] text-sm mb-4">Click below to generate personalized, AI-driven financial insights.</p>
                    <button
                        onClick={handleGenerateInsights}
                        className="bg-brand-purple hover:bg-brand-orange transition-colors text-white text-xs font-bold font-mono uppercase tracking-widest px-6 py-3 rounded-[8px]"
                    >
                        Generate Insights
                    </button>
                </div>
            ) : (
                <div className="space-y-3 mt-4">
                    {recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start space-x-3 bg-black/50 p-3 rounded-[8px] border border-[#333]">
                            <span className="text-brand-purple font-mono text-xs font-bold mt-0.5">0{idx + 1}</span>
                            <p className="text-sm font-sans text-gray-300 leading-relaxed">{rec}</p>
                        </div>
                    ))}
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleGenerateInsights}
                            className={`text-xs font-bold font-mono uppercase tracking-widest px-4 py-2 rounded transition-colors ${!hasGenerated || hasPaid ? 'bg-[#222] hover:bg-[#333] text-white' : 'bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30 border border-[#10B981]/30'}`}
                        >
                            {!hasGenerated || hasPaid ? "Regenerate" : "Unlock Pro Insights (50 ETB)"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
