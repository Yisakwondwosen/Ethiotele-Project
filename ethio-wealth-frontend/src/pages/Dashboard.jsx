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
    FaTrash, FaPen
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

    // Chart Data States
    const [trendData, setTrendData] = useState({ labels: [], datasets: [] });
    const [breakdownData, setBreakdownData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
            const total = data.reduce((acc, curr) => curr.type === 'income' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount), 0);
            setBalance(total);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
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
        } catch (error) { console.warn("Backend error", error); }
    };

    const handleEditClick = (t, e) => {
        e.stopPropagation(); // Prevent row click
        setEditingTransaction({
            ...t,
            categoryId: t.category_id // Map snake_case from DB to camelCase for Modal
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
            try {
                await deleteTransaction(id);
                fetchTransactions();
            } catch (err) {
                console.error("Delete failed", err);
            }
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
            <div className="relative w-full h-48 bg-brand-dark rounded-3xl p-6 text-white shadow-glow flex flex-col justify-between overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-purple rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-brand-orange rounded-full opacity-10 blur-xl"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">{t('total_balance')}</p>
                        <h1 className="text-3xl font-bold tracking-tight">ETB {balance.toFixed(2)}</h1>
                    </div>
                    <BsThreeDots className="text-gray-400 text-xl" />
                </div>

                <div className="relative z-10 flex justify-between items-end">
                    <div className="flex space-x-2 text-sm text-gray-400 font-mono tracking-widest">
                        <span>****</span><span>****</span><span>****</span><span>7585</span>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-brand-dark">{t('analytics')}</h2>
                    {/* Toggle View */}
                    <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-semibold">
                        <button onClick={() => setChartView('trend')} className={`px-3 py-1.5 rounded-md transition ${chartView === 'trend' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-400'}`}>Trend</button>
                        <button onClick={() => setChartView('breakdown')} className={`px-3 py-1.5 rounded-md transition ${chartView === 'breakdown' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-400'}`}>Breakdown</button>
                    </div>
                </div>
                <div className="h-56 w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    {renderChart()}
                </div>
            </div>

            {/* Transactions Section */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-brand-dark">{t('transactions')}</h2>
                    <button onClick={() => setActiveTab('wallet')} className="text-xs font-semibold text-gray-400 hover:text-brand-purple">{t('view_all')}</button>
                </div>

                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <p className="text-center text-gray-400 py-4">No transactions yet. Start adding!</p>
                    ) : transactions.slice(0, 5).map((t) => (
                        <div key={t.id} onClick={() => handleEditClick(t, { stopPropagation: () => { } })} className="group flex justify-between items-center p-4 bg-white border border-gray-50 rounded-2xl shadow-soft hover:shadow-lg transition-shadow cursor-pointer relative">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 ${t.type === 'income' ? 'bg-green-500' : 'bg-brand-orange'} rounded-xl flex items-center justify-center shadow-md text-white`}>
                                    {getIcon(t.icon)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-dark text-sm">{t.description || t.name}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">{t.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`block font-bold text-sm ${t.type === 'income' ? 'text-green-500' : 'text-brand-dark'}`}>
                                    {t.type === 'income' ? '+' : '-'} ETB {Number(t.amount).toFixed(2)}
                                </span>
                                <span className="text-[10px] text-gray-300">{new Date(t.created_at || t.transaction_date || Date.now()).toLocaleDateString()}</span>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition bg-white/90 p-1 rounded-lg shadow-sm">
                                <button onClick={(e) => handleEditClick(t, e)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                                    <FaPen size={12} />
                                </button>
                                <button onClick={(e) => handleDeleteClick(t.id, e)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
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

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-4 text-brand-dark">Top Spending Categories</h3>
                {breakdownData.labels.map((label, i) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: breakdownData.datasets[0].backgroundColor[i] }}></div>
                            <span className="text-sm font-medium text-gray-600">{label}</span>
                        </div>
                        <span className="font-bold text-brand-dark">ETB {Number(breakdownData.datasets[0].data[i]).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-gray font-sans flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 shadow-xl z-20">
                <div className="flex items-center space-x-3 mb-10 pl-2">
                    <span className="text-2xl tracking-tighter text-brand-dark" style={{ fontFamily: '"Permanent Marker", cursive' }}>SANTIM SENTRY</span>
                </div>
                <nav className="flex-1 space-y-2">
                    {['home', 'wallet', 'analytics', 'profile'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === tab ? 'bg-brand-purple text-white shadow-lg shadow-purple-200' : 'text-gray-400 hover:bg-gray-50'}`}>
                            <span className="capitalize">{t(tab)}</span>
                        </button>
                    ))}
                </nav>
                <div className="mt-auto space-y-4">
                    <div className="flex justify-center space-x-2">
                        <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-brand-dark text-white' : 'text-gray-400'}`}>EN</button>
                        <button onClick={() => changeLanguage('am')} className={`px-2 py-1 rounded ${i18n.language === 'am' ? 'bg-brand-dark text-white' : 'text-gray-400'}`}>AM</button>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="relative">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-full" />
                            {user?.fayda_id && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] p-0.5 rounded-full border-2 border-white" title="Verified by National ID">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <h4 className="text-sm font-bold text-brand-dark">{user?.name || "Abraham K."}</h4>
                                {user?.fayda_id && <span className="text-[10px] text-green-600 bg-green-100 px-1 py-0.5 rounded font-mono tracking-tighter">VERIFIED</span>}
                            </div>
                            <button onClick={logout} className="text-xs text-brand-orange hover:underline">Logout</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden">
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onFabClick={() => setIsModalOpen(true)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative p-6 md:p-10">
                <header className="flex justify-between items-center mb-8 md:mb-12">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark hidden md:block">
                            {activeTab === 'home' ? t('dashboard') : activeTab === 'analytics' ? 'Analytics' : t('my_expenses')}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="hidden md:flex items-center space-x-2 bg-brand-orange text-white px-6 py-2.5 rounded-xl shadow-glow-orange hover:opacity-90 transition">
                            <span className="font-bold">+ {t('add_transaction')}</span>
                        </button>
                        <Notifications />
                    </div>
                </header>

                <div className="max-w-5xl mx-auto">
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
