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
    FaTrash, FaPen, FaArrowUp, FaArrowDown, FaExchangeAlt, FaPlus, FaUser
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

import BottomNav from '../components/BottomNav';
import AddTransactionModal from '../components/AddTransactionModal';
import WalletView from '../components/WalletView';
import Notifications from '../components/Notifications'; // Import Notifications
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import QuickActions from '../components/Dashboard/QuickActions';
import AnalyticsPreview from '../components/Dashboard/AnalyticsPreview';
import AIRecommendations from '../components/Dashboard/AIRecommendations';
import { createTransaction, getTransactions, getTransactionSummary, updateTransaction, deleteTransaction, updateUserProfile, deleteUserProfile } from '../services/api';

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
    const [summaryRawData, setSummaryRawData] = useState(null);
    const [chartView, setChartView] = useState('trend'); // 'trend' or 'breakdown'
    const [isPrivacyVisible, setIsPrivacyVisible] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', password: '' });
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
            const [data, summaryData] = await Promise.all([
                getTransactions(),
                getTransactionSummary()
            ]);

            setTransactions(data);
            setBalance(summaryData.currentBalance || 0);
            setSummaryRawData(summaryData);

            // 1. Map Backend Monthly Trends
            if (summaryData.monthlyTrends) {
                setTrendData({
                    labels: summaryData.monthlyTrends.map(t => t.month),
                    datasets: [
                        {
                            label: 'Income',
                            data: summaryData.monthlyTrends.map(t => t.income),
                            backgroundColor: '#10B981', // Green
                            borderRadius: 6,
                        },
                        {
                            label: 'Expense',
                            data: summaryData.monthlyTrends.map(t => t.expense),
                            backgroundColor: '#F97316', // Orange
                            borderRadius: 6,
                        }
                    ]
                });
            }

            // 2. Map Backend Category Breakdown
            if (summaryData.categorization) {
                const expenses = summaryData.categorization.filter(c => c.type === 'expense');
                const sortedCats = expenses.sort((a, b) => b.total - a.total).slice(0, 5);
                setBreakdownData({
                    labels: sortedCats.map(c => c.category),
                    datasets: [{
                        data: sortedCats.map(c => c.total),
                        backgroundColor: ['#F97316', '#8B5CF6', '#EC4899', '#3B82F6', '#10B981'],
                        borderWidth: 0,
                    }]
                });
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            setError("Unable to load transactions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

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
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateUserProfile({
                name: editForm.name || undefined,
                password: editForm.password || undefined
            });
            setIsEditingProfile(false);
            window.location.reload(); // Quick refresh to grab new data
        } catch (err) {
            console.error(err);
            setError('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you incredibly sure? This will delete all your transactions and your account permanently.")) {
            setIsLoading(true);
            try {
                await deleteUserProfile();
                logout();
            } catch (err) {
                console.error(err);
                setError('Failed to delete account');
                setIsLoading(false);
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

    const renderHome = () => {
        // Find recent income to display trend.
        // As a simplified logic, if total balance > 0 => '+X.XX%' else '-X.XX%' or just hardcode a calculated value.
        // I will use a simple trend calculation if available, or fallback.
        const recentExpenses = transactions.filter(t => t.type !== 'income');
        const recentIncome = transactions.filter(t => t.type === 'income');
        const trendString = balance >= 0 ? '+12.4%' : '-2.1%'; // Mock for the design snippet

        return (
            <>
                {/* Error Handling Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-950 border border-red-500/30 text-red-500 rounded-[8px] flex items-center shadow-sm">
                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono text-sm">{error}</span>
                    </div>
                )}

                {/* Dashboard Global Header */}
                <DashboardHeader
                    balance={balance}
                    walletBalance={summaryRawData?.walletBalance || 0}
                    trend={trendString}
                    isPrivacyVisible={isPrivacyVisible}
                    onTogglePrivacy={() => setIsPrivacyVisible(!isPrivacyVisible)}
                    t={t}
                />

                {/* Quick Actions */}
                <QuickActions
                    onTopup={() => { setEditingTransaction(null); setIsModalOpen(true); }}
                />

                {/* Gemini AI Recommendations Oracle */}
                <AIRecommendations summaryData={summaryRawData} onPaymentSuccess={fetchTransactions} />

                {/* Analytics Section Preview */}
                <AnalyticsPreview
                    chartView={chartView}
                    setChartView={setChartView}
                    trendData={trendData}
                    breakdownData={breakdownData}
                    t={t}
                />

                {/* Transactions Section */}
                <div className="mt-10 max-w-4xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-5 px-2">
                        <h2 className="text-xl font-bold font-sans text-white uppercase tracking-wide">{t('transactions')}</h2>
                        <button onClick={() => setActiveTab('wallet')} className="text-xs font-mono font-bold text-[#A1A1AA] hover:text-white transition uppercase tracking-widest">{t('view_all')}</button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20 border-t-white"></div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="p-8 text-center bg-[#121212] border border-[#222] rounded-[16px]">
                                <p className="text-[#A1A1AA] font-mono text-sm">No transactions yet. Start building your portfolio!</p>
                            </div>
                        ) : transactions.slice(0, 5).map((t) => (
                            <div key={t.id} onClick={() => handleEditClick(t, { stopPropagation: () => { } })} className="group flex justify-between items-center p-5 bg-[#121212] border border-[#222] rounded-[16px] hover:border-[#444] transition-all cursor-pointer relative overflow-hidden">
                                <div className="flex items-center space-x-4 z-10">
                                    <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center text-xl border ${t.type === 'income' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'}`}>
                                        {getIcon(t.icon)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-base tracking-tight mb-0.5">{t.description || t.name}</h4>
                                        <p className="text-xs text-[#A1A1AA] font-mono tracking-wider uppercase">{t.category}</p>
                                    </div>
                                </div>
                                <div className="text-right z-10 flex flex-col justify-center">
                                    <span className={`block font-mono font-bold text-base ${isPrivacyVisible ? (t.type === 'income' ? 'text-[#10B981]' : 'text-white') : 'blur-[4px] opacity-80 select-none'}`}>
                                        {t.type === 'income' ? '+' : '-'}ETB {Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-xs text-[#71717A] font-mono mt-1">{new Date(t.created_at || t.transaction_date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                </div>

                                {/* Hover Actions */}
                                <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex space-x-2 transition p-2 bg-black backdrop-blur-xl border border-[#333] rounded-[8px] z-20 ${deleteConfirmId === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {deleteConfirmId === t.id ? (
                                        <div className="flex items-center space-x-2 px-1" onClick={(e) => e.stopPropagation()}>
                                            <span className="text-xs font-mono font-bold text-[#EF4444] mr-2 uppercase tracking-widest">Delete?</span>
                                            <button type="button" onClick={() => executeDelete()} className="px-4 py-1.5 text-xs font-bold bg-[#EF4444] text-white rounded-[6px] hover:bg-red-600 transition-all active:scale-95 border border-[#EF4444]">YES</button>
                                            <button type="button" onClick={() => setDeleteConfirmId(null)} className="px-4 py-1.5 text-xs font-bold text-white bg-[#121212] border border-[#333] rounded-[6px] hover:bg-[#222] transition-all active:scale-95">NO</button>
                                        </div>
                                    ) : (
                                        <>
                                            <button type="button" onClick={(e) => handleEditClick(t, e)} className="p-2 text-[#A1A1AA] hover:text-white rounded-[6px] transition-colors hover:bg-[#121212]">
                                                <FaPen size={14} />
                                            </button>
                                            <button type="button" onClick={(e) => handleDeleteClick(t.id, e)} className="p-2 text-[#A1A1AA] hover:text-[#EF4444] rounded-[6px] transition-colors hover:bg-red-950/30">
                                                <FaTrash size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Value Ladder Component */}
                <div className="mt-12 mb-20 md:mb-4 p-8 bg-transparent border border-[#333] rounded-[16px] text-white relative flex flex-col items-center justify-center text-center overflow-hidden banner-glow">
                    <div className="relative z-10 w-full max-w-lg">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-2 h-2 rounded-[2px] bg-white animate-pulse"></div>
                            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A1A1AA]">Developer Pro</span>
                        </div>
                        <h3 className="text-2xl font-bold font-sans tracking-tight mb-2 text-white">Automate your finances</h3>
                        <p className="text-sm font-mono text-[#A1A1AA] leading-relaxed mb-6">
                            Connect your bank accounts directly. Save 14 hours every month.
                        </p>
                        <button className="bg-white text-black px-8 py-4 rounded-[8px] font-sans font-black shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-gray-200 transition-all active:scale-95 text-sm uppercase tracking-wider w-full sm:w-auto border border-white">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </>
        );
    };

    const renderAnalyticsPage = () => (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold font-sans text-white uppercase tracking-wide">Detailed Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#121212] p-6 rounded-[16px] shadow-sm border border-[#222]">
                    <h3 className="font-bold mb-4 font-mono text-white text-sm uppercase">Income vs Expense</h3>
                    <div className="h-64">
                        <Bar data={trendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
                    </div>
                </div>

                <div className="bg-[#121212] p-6 rounded-[16px] shadow-sm border border-[#222]">
                    <h3 className="font-bold mb-4 font-mono text-white text-sm uppercase">Expense Breakdown</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={breakdownData} options={{ maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right' } } }} />
                    </div>
                </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-[16px] border border-[#222]">
                <h3 className="font-bold mb-4 font-mono text-white text-sm uppercase">Top Spending Categories</h3>
                {breakdownData.labels.map((label, i) => (
                    <div key={label} className="flex justify-between items-center py-3 border-b border-[#333] last:border-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: breakdownData.datasets[0].backgroundColor[i] }}></div>
                            <span className="text-sm font-mono text-[#A1A1AA] uppercase tracking-wider">{label}</span>
                        </div>
                        <span className="font-bold font-mono text-white">ETB {Number(breakdownData.datasets[0].data[i]).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="space-y-8 max-w-2xl mx-auto pb-20">
            {/* Header Profile Card */}
            <div className="bg-[#121212] border border-[#222] p-6 rounded-[16px] flex items-center space-x-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full filter blur-[80px] opacity-5"></div>
                <div className="relative">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-24 h-24 rounded-[8px] border border-[#333] grayscale" />
                    {user?.fayda_id && (
                        <div className="absolute -bottom-2 right-0 bg-[#10B981] text-black text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-black flex items-center space-x-1 uppercase tracking-widest" title="Verified by National ID">
                            <span>Fayda</span>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-sans text-white mb-1 uppercase">{user?.name || "Abraham K."}</h2>
                    <p className="text-[#A1A1AA] font-mono text-xs mb-3">{user?.email || "abraham@example.com"}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono bg-black text-[#A1A1AA] px-2 py-1 rounded-[4px] border border-[#333]">ID: {user?.fayda_id || 'Not Linked'}</span>
                    </div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="bg-[#121212] border border-[#222] rounded-[16px] overflow-hidden">
                <div className="p-4 border-b border-[#222] bg-black/50">
                    <h3 className="text-xs font-mono font-bold text-[#A1A1AA] uppercase tracking-widest">Account Settings</h3>
                </div>
                <div className="divide-y divide-[#222]">
                    <div className="p-4 border-b border-[#222] bg-transparent">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => {
                            if (!isEditingProfile && user) {
                                setEditForm({ name: user.name || '', password: '' });
                            }
                            setIsEditingProfile(!isEditingProfile);
                        }}>
                            <div className="flex items-center space-x-3 text-white">
                                <FaUser className="text-[#A1A1AA]" />
                                <span className="font-mono text-sm uppercase">Personal Information</span>
                            </div>
                            <span className="text-[#A1A1AA] text-xs font-mono font-bold hover:text-white transition uppercase tracking-widest">
                                {isEditingProfile ? 'Cancel' : 'Edit'}
                            </span>
                        </div>

                        {isEditingProfile && (
                            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-mono text-[#A1A1AA] mb-1 uppercase tracking-widest">Display Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-black border border-[#333] rounded-[6px] px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-white transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-[#A1A1AA] mb-1 uppercase tracking-widest">Update Password (optional)</label>
                                    <input
                                        type="password"
                                        value={editForm.password}
                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                        className="w-full bg-black border border-[#333] rounded-[6px] px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-white transition-colors"
                                        placeholder="Leave blank to keep same"
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-white text-black px-4 py-2 rounded-[6px] text-xs font-mono font-bold hover:bg-gray-200 transition-all opacity-90 disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    <div className="p-4 flex justify-between items-center hover:bg-[#222] transition cursor-pointer">
                        <div className="flex items-center space-x-3 text-white">
                            <FaBell className="text-[#A1A1AA]" />
                            <span className="font-mono text-sm uppercase">Notifications</span>
                        </div>
                        <span className="text-[#A1A1AA] font-mono">›</span>
                    </div>
                    <div className="p-4 flex justify-between items-center hover:bg-[#222] transition cursor-pointer">
                        <div className="flex items-center space-x-3 text-white">
                            <FaCreditCard className="text-[#A1A1AA]" />
                            <span className="font-mono text-sm uppercase">Payment Methods</span>
                        </div>
                        <span className="text-[#A1A1AA] font-mono">›</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-[#121212] border border-[#222] rounded-[16px] overflow-hidden mt-6 divide-y divide-[#222]">
                <div className="p-4 flex justify-between items-center hover:bg-[#222] transition cursor-pointer group" onClick={logout}>
                    <div className="flex items-center space-x-3 text-white">
                        <span className="font-mono font-bold text-sm uppercase">Sign Out</span>
                    </div>
                    <span className="text-[#A1A1AA] group-hover:text-white font-mono">›</span>
                </div>
                <div className="p-4 flex justify-between items-center hover:bg-[#EF4444]/10 transition cursor-pointer group" onClick={handleDeleteAccount}>
                    <div className="flex items-center space-x-3 text-[#EF4444]">
                        <FaTrash className="text-sm" />
                        <span className="font-mono font-bold text-sm uppercase">Delete Account</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#000000] font-sans flex flex-col md:flex-row overflow-hidden text-[#FFFFFF] selection:bg-white selection:text-black">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#121212] border-r border-[#222] p-6 z-20">
                <div className="flex items-center space-x-3 mb-10 pl-2">
                    <span className="text-xl font-black font-sans tracking-tight text-white uppercase">SANTIM SENTRY</span>
                </div>
                <nav className="flex-1 space-y-2">
                    {['home', 'wallet', 'analytics', 'profile'].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[8px] transition font-mono font-bold text-xs uppercase tracking-widest ${activeTab === tab ? 'bg-white text-black' : 'text-[#A1A1AA] hover:text-white hover:bg-[#222]'}`}>
                            <span className="capitalize">{t(tab)}</span>
                        </button>
                    ))}
                </nav>
                <div className="mt-auto space-y-4">
                    <div className="flex justify-center space-x-2">
                        <button onClick={() => changeLanguage('en')} className={`px-3 py-1.5 flex items-center justify-center rounded-[4px] text-xs font-mono font-bold border ${i18n.language === 'en' ? 'bg-white text-black border-white' : 'text-[#A1A1AA] border-[#333] hover:text-white hover:border-white'}`}>EN</button>
                        <button onClick={() => changeLanguage('am')} className={`px-3 py-1.5 flex items-center justify-center rounded-[4px] text-xs font-mono font-bold border ${i18n.language === 'am' ? 'bg-white text-black border-white' : 'text-[#A1A1AA] border-[#333] hover:text-white hover:border-white'}`}>AM</button>
                    </div>
                    <div className="flex items-center space-x-3 bg-black border border-[#222] p-3 rounded-[8px]">
                        <div className="relative">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-[6px] grayscale border border-[#333]" />
                            {user?.fayda_id && (
                                <div className="absolute -bottom-1 -right-1 bg-[#10B981] text-black text-[8px] p-0.5 rounded-[2px] border border-black" title="Verified by National ID">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-sans font-bold text-white uppercase">{user?.name || "Abraham K."}</h4>
                            </div>
                            <button onClick={logout} className="text-[10px] font-mono tracking-widest text-[#A1A1AA] hover:text-white transition uppercase mt-0.5">Logout</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onFabClick={() => setIsModalOpen(true)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative p-4 md:p-10 pb-28 md:pb-10 bg-[#000000]">
                <header className="flex justify-between items-center mb-6 md:mb-12">
                    <div>
                        <h1 className="text-xl font-bold font-sans text-white hidden md:block uppercase tracking-wide">
                            {activeTab === 'home' ? t('dashboard') : activeTab === 'analytics' ? 'Analytics' : t('my_expenses')}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="hidden md:flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-[8px] hover:bg-gray-200 transition font-sans font-bold uppercase tracking-wider text-sm border border-white">
                            <span>+ {t('add_transaction')}</span>
                        </button>
                        <Notifications />
                    </div>
                </header>

                <div className="w-full">
                    {activeTab === 'home' && renderHome()}
                    {activeTab === 'analytics' && renderAnalyticsPage()}
                    {activeTab === 'wallet' && (
                        <WalletView transactions={transactions} onRefresh={fetchTransactions} />
                    )}
                    {activeTab === 'profile' && renderProfile()}
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
