import React, { useState } from 'react';
import { FaWallet, FaPlus, FaHistory, FaMobileAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const WalletView = ({ transactions, onRefresh }) => {
    const { user } = useAuth();
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'

    // Calculate Balance
    const balance = transactions.reduce((acc, curr) =>
        curr.type === 'income' ? acc + Number(curr.amount) : acc - Number(curr.amount), 0
    );

    const handleTopUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://yisehak.duckdns.org/api/telebirr/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, phoneNumber: phone })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                onRefresh(); // Refresh transactions
                setTimeout(() => {
                    setIsTopUpOpen(false);
                    setStatus(null);
                    setAmount('');
                    setPhone('');
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Top up failed", error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-brand-dark via-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-brand-orange rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>

                <div className="relative z-10 flex justify-between items-start mb-12">
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">Total Balance</p>
                        <h2 className="text-4xl font-extrabold tracking-tight">ETB {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-sm">
                        <FaWallet size={24} className="text-white opacity-90" />
                    </div>
                </div>

                <div className="relative z-10 flex space-x-4">
                    <button
                        onClick={() => setIsTopUpOpen(true)}
                        className="flex-1 flex justify-center items-center space-x-2 bg-brand-orange text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors"
                    >
                        <FaPlus />
                        <span>Add Money</span>
                    </button>
                    <button className="flex-1 flex justify-center items-center space-x-2 bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-white/20 transition backdrop-blur-sm border border-white/5">
                        <FaHistory />
                        <span>History</span>
                    </button>
                </div>
            </div>

            {/* Recent Transactions */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 px-1">Recent Activity</h3>
                <div className="space-y-3">
                    {transactions.slice(0, 5).map(t => (
                        <div key={t.id} className="bg-[#09090B] p-4 rounded-3xl border border-white/10 flex justify-between items-center transition-all hover:bg-white/5">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${t.is_telebirr ? 'bg-blue-500/10 text-blue-500 bg-opacity-20' : 'bg-white/5 text-zinc-400'}`}>
                                    {t.is_telebirr ? <FaMobileAlt /> : <FaHistory />}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-base">{t.description}</p>
                                    <p className="text-xs font-medium text-zinc-500 mt-0.5">{new Date(t.created_at || t.transaction_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <span className={`font-extrabold text-base tracking-tight ${t.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                                {t.type === 'income' ? '+' : '-'}ETB {Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Up Modal */}
            {
                isTopUpOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-[#09090B] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl transform transition-all animate-fadeIn relative">
                            <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Top Up with Telebirr</h3>

                            {!status && (
                                <form onSubmit={handleTopUp} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-zinc-500"
                                            placeholder="09..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">Amount (ETB)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-zinc-500"
                                            placeholder="0.00"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="pt-4 flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsTopUpOpen(false)}
                                            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-3.5 px-4 bg-brand-orange text-white rounded-xl font-bold shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:bg-orange-600 hover:scale-[1.02] transition-all flex justify-center items-center disabled:opacity-50"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Pay Now'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {status === 'success' && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-bounce">✓</div>
                                    <h4 className="text-xl font-bold text-white">Payment Successful!</h4>
                                    <p className="text-zinc-500 mt-2">Your wallet has been credited.</p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✕</div>
                                    <h4 className="text-xl font-bold text-white">Payment Failed</h4>
                                    <p className="text-zinc-500 mt-2">Please try again.</p>
                                    <button onClick={() => setStatus(null)} className="mt-4 text-brand-purple font-bold hover:text-white transition-colors">Try Again</button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default WalletView;
