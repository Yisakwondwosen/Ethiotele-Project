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
            const res = await fetch('http://localhost:3000/api/telebirr/pay', {
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
            <div className="bg-gradient-to-r from-brand-dark to-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 flex justify-between items-start mb-12">
                    <div>
                        <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Total Balance</p>
                        <h2 className="text-4xl font-bold">ETB {balance.toFixed(2)}</h2>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <FaWallet size={24} className="text-brand-orange" />
                    </div>
                </div>

                <div className="relative z-10 flex space-x-4">
                    <button
                        onClick={() => setIsTopUpOpen(true)}
                        className="flex items-center space-x-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-brand-orange/90 transition"
                    >
                        <FaPlus />
                        <span>Add Money</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition backdrop-blur-sm">
                        <FaHistory />
                        <span>History</span>
                    </button>
                </div>
            </div>

            {/* Recent Transactions (Filtered for Telebirr logic if needed, but showing all for now) */}
            <div>
                <h3 className="text-xl font-bold text-brand-dark mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {transactions.slice(0, 5).map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-gray-50">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.is_telebirr ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                                    {t.is_telebirr ? <FaMobileAlt /> : <FaHistory />}
                                </div>
                                <div>
                                    <p className="font-bold text-brand-dark">{t.description}</p>
                                    <p className="text-xs text-gray-400">{new Date(t.created_at || t.transaction_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-brand-dark'}`}>
                                {t.type === 'income' ? '+' : '-'} ETB {Number(t.amount).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Up Modal */}
            {isTopUpOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
                        <h3 className="text-2xl font-bold text-brand-dark mb-6">Top Up with Telebirr</h3>

                        {!status && (
                            <form onSubmit={handleTopUp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition"
                                        placeholder="09..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Amount (ETB)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition"
                                        placeholder="0.00"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="pt-4 flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsTopUpOpen(false)}
                                        className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex justify-center items-center disabled:opacity-50"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Pay Now'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {status === 'success' && (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-bounce">✓</div>
                                <h4 className="text-xl font-bold text-brand-dark">Payment Successful!</h4>
                                <p className="text-gray-500 mt-2">Your wallet has been credited.</p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✕</div>
                                <h4 className="text-xl font-bold text-brand-dark">Payment Failed</h4>
                                <p className="text-gray-500 mt-2">Please try again.</p>
                                <button onClick={() => setStatus(null)} className="mt-4 text-brand-purple font-bold hover:underline">Try Again</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletView;
