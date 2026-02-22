import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    FaBell, FaShoppingBag, FaUtensils, FaBus, FaFileInvoiceDollar,
    FaNotesMedical, FaFilm, FaMoneyBillWave, FaBriefcase, FaCreditCard,
    FaTrash, FaPen, FaArrowUp, FaArrowDown, FaExchangeAlt, FaPlus
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

import BottomNav from '../components/BottomNav';
import AddTransactionModal from '../components/AddTransactionModal';
import WalletView from '../components/WalletView';
import Notifications from '../components/Notifications'; // Import Notifications
import { createTransaction, getTransactions, updateTransaction, deleteTransaction } from '../services/api';

// Register ChartJS Components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Icon Mapper for Categories
const IconMap = {
    FaUtensils: <FaUtensils />,
    FaShoppingBag: <FaShoppingBag />,
    FaBus: <FaBus />,
    FaFileInvoiceDollar: <FaFileInvoiceDollar />,
    FaNotesMedical: <FaNotesMedical />,
    FaFilm: <FaFilm />,
    FaMoneyBillWave: <FaMoneyBillWave />,
    FaBriefcase: <FaBriefcase />,
    FaCreditCard: <FaCreditCard />
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState('home');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [chartView, setChartView] = useState('trend'); // 'trend' or 'breakdown'
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Chart Data States
    const [trendData, setTrendData] = useState({ labels: [], datasets: [] });
    const [breakdownData, setBreakdownData] = useState({ labels: [], datasets: [] });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTransactions();
            setTransactions(data);
            const total = data.reduce((acc, curr) => curr.type === 'income' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount), 0);
            setBalance(total);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
            setError("Unable to load transactions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate Analytics Data
    useEffect(() => {
        if (!transactions) return;

        // 1. Monthly Trends (Last 6 Months)
        const months = [];
        const income = [];
        const expense = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthLabel = d.toLocaleString('en-US', { month: 'short' });
            months.push(monthLabel);

            // Filter entries for this month
            const monthlyTx = transactions.filter(t => {
                const tDate = new Date(t.created_at || t.transaction_date || Date.now());
                return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
            });

            const inc = monthlyTx.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
            const exp = monthlyTx.filter(t => t.type !== 'income').reduce((sum, t) => sum + Number(t.amount), 0);

            income.push(inc);
            expense.push(exp);
        }

        setTrendData({
            labels: months,
            datasets: [
                {
                    label: 'Income',
                    data: income,
                    backgroundColor: '#10B981', // Green
                    borderRadius: 6,
                },
                {
                    label: 'Expense',
                    data: expense,
                    backgroundColor: '#F97316', // Orange
                    borderRadius: 6,
                }
            ]
        });

        // 2. Category Breakdown (Expenses Only)
        const expenses = transactions.filter(t => t.type !== 'income');
        const categories = {};
        expenses.forEach(t => {
            const cat = t.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + Number(t.amount);
        });

        const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);

        setBreakdownData({
            labels: sortedCats.map(c => c[0]),
            datasets: [{
                data: sortedCats.map(c => c[1]),
                backgroundColor: ['#F97316', '#8B5CF6', '#EC4899', '#3B82F6', '#10B981'],
                borderWidth: 0,
            }]
        });

    }, [transactions]);

    const handleAddTransaction = async (newTx) => {
        setIsLoading(true);
        setError(null);
        try {
            if (newTx.id) {
                // Update
                await updateTransaction(newTx.id, {
                    amount: newTx.amount,
                    description: newTx.description,
                    categoryId: newTx.categoryId,
                    isTelebirr: false,
                    type: newTx.type
                });
            } else {
                // Create
                await createTransaction({
                    amount: newTx.amount,
                    description: newTx.description,
                    categoryId: newTx.categoryId,
                    isTelebirr: false,
                    type: newTx.type
                });
            }
            fetchTransactions();
            setEditingTransaction(null);
            setIsModalOpen(false);
        } catch (error) {
            console.warn("Backend error", error);
            setError("Failed to save transaction. Please check your network and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (t, e) => {
        e.stopPropagation(); // Prevent row click
        setEditingTransaction({
            ...t,
            categoryId: t.category_id // Map snake_case from DB to camelCase for Modal
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const executeDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await deleteTransaction(deleteConfirmId);
            fetchTransactions();
            setDeleteConfirmId(null);
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const changeLanguage = (lng) => i18n.changeLanguage(lng);
    const getIcon = (iconSlug) => IconMap[iconSlug] || <FaShoppingBag />;

    const renderChart = () => {
        if (chartView === 'trend') {
            return <Bar data={trendData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { display: false } }, plugins: { legend: { display: false } } }} />;
        }
        return (
            <div className="relative h-full flex items-center justify-center">
                <Doughnut data={breakdownData} options={{ maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 6 } } } }} />
            </div>
        );
    };

    const renderHome = () => (
        <>
            {/* Error Handling Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 border border-red-200 rounded-xl flex items-center shadow-sm">
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-sm">{error}</span>
                </div>
            )}

            <div className="relative w-full h-52 bg-[#09090B] border border-white/10 rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-brand-orange rounded-full mix-blend-screen filter blur-[80px] opacity-10"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1">{t('total_balance')}</p>
                        <h1 className="text-4xl font-extrabold tracking-tight">ETB {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/10 transition cursor-pointer">
                        <BsThreeDots className="text-zinc-400 text-xl" />
                    </div>
                </div>

                <div className="relative z-10 flex justify-between items-end">
                    <div className="flex space-x-2 text-sm text-zinc-500 font-mono tracking-widest">
                        <span>****</span><span>****</span><span>****</span><span>7585</span>
                    </div>
                    <div className="w-10 h-6 bg-white/10 backdrop-blur-md rounded border border-white/5 flex items-center justify-center opacity-80">
                        <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    </div>
                </div>
            </div>

            {/* Quick Actions (Mobile UI Style) */}
            <div className="flex justify-between items-center mt-6 px-1 space-x-4">
                <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="flex-1 flex flex-col items-center justify-center space-y-2 group">
                    <div className="w-14 h-14 bg-[#09090B] rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white transition-all">
                        <FaArrowUp />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">Send</span>
                </button>
                <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="flex-1 flex flex-col items-center justify-center space-y-2 group">
                    <div className="w-14 h-14 bg-[#09090B] rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white transition-all">
                        <FaArrowDown />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">Receive</span>
                </button>
                <button className="flex-1 flex flex-col items-center justify-center space-y-2 group">
                    <div className="w-14 h-14 bg-[#09090B] rounded-2xl shadow-sm flex items-center justify-center text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white transition-all">
                        <FaExchangeAlt />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">Exchange</span>
                </button>
                <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="flex-1 flex flex-col items-center justify-center space-y-2 group">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-black hover:scale-105 transition-transform">
                        <FaPlus />
                    </div>
                    <span className="text-xs text-white font-medium">Topup</span>
                </button>
            </div>

            {/* Analytics Section */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-6 px-1">
                    <h2 className="text-lg font-bold text-white">{t('analytics')}</h2>
                    {/* Toggle View */}
                    <div className="bg-[#09090B] border border-white/10 p-1 rounded-lg flex text-xs font-medium">
                        <button onClick={() => setChartView('trend')} className={`px-3 py-1.5 rounded-md transition ${chartView === 'trend' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Trend</button>
                        <button onClick={() => setChartView('breakdown')} className={`px-3 py-1.5 rounded-md transition ${chartView === 'breakdown' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Breakdown</button>
                    </div>
                </div>
                <div className="h-60 w-full bg-[#09090B] p-5 rounded-3xl border border-white/10">
                    {renderChart()}
                </div>
            </div>

            {/* Transactions Section */}
            <div className="mt-10">
                <div className="flex justify-between items-center mb-5 px-1">
                    <h2 className="text-lg font-bold text-white">{t('transactions')}</h2>
                    <button onClick={() => setActiveTab('wallet')} className="text-xs font-medium text-zinc-500 hover:text-white transition">{t('view_all')}</button>
                </div>

                <div className="space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20 border-t-white"></div>
                        </div>
                    ) : transactions.length === 0 ? (
                        <p className="text-center text-zinc-600 py-4">No transactions yet. Start adding!</p>
                    ) : transactions.slice(0, 5).map((t) => (
                        <div key={t.id} onClick={() => handleEditClick(t, { stopPropagation: () => { } })} className="group flex justify-between items-center p-4 bg-[#09090B] border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-pointer relative">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${t.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {getIcon(t.icon)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{t.description || t.name}</h4>
                                    <p className="text-xs text-zinc-500 mt-0.5 font-medium">{t.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`block font-bold text-sm tracking-tight ${t.type === 'income' ? 'text-green-400' : 'text-zinc-300'}`}>
                                    {t.type === 'income' ? '+' : '-'}ETB {Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-xs text-zinc-600 font-medium">{new Date(t.created_at || t.transaction_date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            {/* Hover Actions */}
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2 transition bg-black/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10 ${deleteConfirmId === t.id ? 'opacity-100 z-10' : 'opacity-0 group-hover:opacity-100'}`}>
                                {deleteConfirmId === t.id ? (
                                    <div className="flex items-center space-x-1.5 px-1 py-0.5" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-[10px] font-extrabold text-red-500 mr-2 uppercase tracking-wider">Delete?</span>
                                        <button type="button" onClick={() => executeDelete()} className="px-3 py-1 text-[11px] font-bold bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)] rounded-md hover:bg-red-600 transition-all active:scale-95">Yes</button>
                                        <button type="button" onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-all active:scale-95">No</button>
                                    </div>
                                ) : (
                                    <>
                                        <button type="button" onClick={(e) => handleEditClick(t, e)} className="p-2 text-zinc-400 hover:text-white rounded transition-colors">
                                            <FaPen size={12} />
                                        </button>
                                        <button type="button" onClick={(e) => handleDeleteClick(t.id, e)} className="p-2 text-zinc-400 hover:text-red-400 rounded transition-colors">
                                            <FaTrash size={12} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DotCom Secrets Value Ladder / Epiphany Bridge - Modernized & Subtle */}
            <div className="mt-10 mb-20 md:mb-4 p-6 bg-[#09090B] border border-white/10 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
                <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-brand-purple rounded-full mix-blend-screen filter blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0 max-w-lg">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-orange">Pro Plan</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1 text-white">Tired of manual tracking?</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                            Unlock bank-level auto sync and save up to 14 hours a month.
                        </p>
                    </div>
                    <button className="w-full md:w-auto flex-shrink-0 bg-white text-black px-6 py-3 rounded-lg font-bold shadow-soft hover:bg-zinc-200 transition-all active:scale-95 text-sm">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </>
    );

    const renderAnalyticsPage = () => (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-brand-dark">Detailed Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4 text-brand-dark">Income vs Expense</h3>
                    <div className="h-64">
                        <Bar data={trendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4 text-brand-dark">Expense Breakdown</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={breakdownData} options={{ maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right' } } }} />
                    </div>
                </div>
            </div>

            <div className="bg-[#09090B] p-6 rounded-3xl border border-white/10">
                <h3 className="font-bold mb-4 text-white">Top Spending Categories</h3>
                {breakdownData.labels.map((label, i) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: breakdownData.datasets[0].backgroundColor[i] }}></div>
                            <span className="text-sm font-medium text-zinc-400">{label}</span>
                        </div>
                        <span className="font-bold text-white">ETB {Number(breakdownData.datasets[0].data[i]).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#000000] font-sans flex flex-col md:flex-row overflow-hidden text-zinc-100 selection:bg-brand-purple selection:text-white">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#09090B] border-r border-white/10 p-6 z-20">
                <div className="flex items-center space-x-3 mb-10 pl-2">
                    <span className="text-2xl font-extrabold tracking-tight text-white" style={{ fontFamily: '"Outfit", sans-serif' }}>SANTIM SENTRY</span>
                </div>
                <nav className="flex-1 space-y-2">
                    {['home', 'wallet', 'analytics', 'profile'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition font-medium text-sm ${activeTab === tab ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                            <span className="capitalize">{t(tab)}</span>
                        </button>
                    ))}
                </nav>
                <div className="mt-auto space-y-4">
                    <div className="flex justify-center space-x-2">
                        <button onClick={() => changeLanguage('en')} className={`px-2 py-1 flex items-center justify-center rounded text-xs font-bold ${i18n.language === 'en' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-white'}`}>EN</button>
                        <button onClick={() => changeLanguage('am')} className={`px-2 py-1 flex items-center justify-center rounded text-xs font-bold ${i18n.language === 'am' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-white'}`}>AM</button>
                    </div>
                    <div className="flex items-center space-x-3 bg-black border border-white/10 p-3 rounded-xl">
                        <div className="relative">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-full" />
                            {user?.fayda_id && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 text-black text-[8px] p-0.5 rounded-full border border-black" title="Verified by National ID">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-bold text-white">{user?.name || "Abraham K."}</h4>
                                {user?.fayda_id && <span className="text-[9px] text-green-400 bg-green-500/10 px-1 py-0.5 rounded font-mono tracking-tighter">VERIFIED</span>}
                            </div>
                            <button onClick={logout} className="text-xs text-zinc-500 hover:text-white transition">Logout</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden bg-[#09090B] border-t border-white/10 fixed bottom-0 w-full z-50">
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onFabClick={() => setIsModalOpen(true)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative p-6 md:p-10 pb-24 md:pb-10">
                <header className="flex justify-between items-center mb-8 md:mb-12">
                    <div>
                        <h1 className="text-2xl font-bold text-white hidden md:block" style={{ fontFamily: '"Outfit", sans-serif' }}>
                            {activeTab === 'home' ? t('dashboard') : activeTab === 'analytics' ? 'Analytics' : t('my_expenses')}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="hidden md:flex items-center space-x-2 bg-white text-black px-5 py-2 rounded-lg hover:bg-zinc-200 transition">
                            <span className="font-bold text-sm">+ {t('add_transaction')}</span>
                        </button>
                        <Notifications />
                    </div>
                </header>

                <div className="max-w-4xl mx-auto">
                    {activeTab === 'home' && renderHome()}
                    {activeTab === 'analytics' && renderAnalyticsPage()}
                    {/* Explicit Wallet View for Transactions List (Editable) */}
                    {activeTab === 'wallet' && (
                        <WalletView transactions={transactions} onRefresh={fetchTransactions} />
                    )}
                </div>
            </main>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
                onAdd={handleAddTransaction}
                initialData={editingTransaction}
            />
        </div>
    );
};

export default Dashboard;
