import React, { useState, useEffect } from 'react';
import { FaTimes, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { getCategories } from '../services/api';

const AddTransactionModal = ({ isOpen, onClose, onAdd, initialData = null }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('expense'); // 'income' or 'expense'
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount);
            setDescription(initialData.description || initialData.name);
            setType(initialData.type);
            // We need to wait for categories to load to set ID, or set it if known
            // initialData should have categoryId if we pass it correctly
            if (initialData.categoryId) setCategoryId(initialData.categoryId);
        } else {
            // Reset
            setAmount('');
            setDescription('');
            setType('expense');
            setCategoryId('');
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getCategories()
                .then(data => {
                    setCategories(data);
                })
                .catch(err => console.error("Failed to load categories", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    // Filter categories based on selected type
    const filteredCategories = categories.filter(cat => cat.type === type);

    // Set default category ONLY if not editing or type changed explicitly
    useEffect(() => {
        if (initialData && initialData.type === type && initialData.categoryId) {
            // Keep existing ID if type matches initial
            return;
        }

        if (filteredCategories.length > 0 && !categoryId) {
            setCategoryId(filteredCategories[0].id);
        }
    }, [type, categories, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !description || !categoryId) return;

        const selectedCat = categories.find(c => c.id === parseInt(categoryId));

        onAdd({
            id: initialData ? initialData.id : undefined, // Check if editing
            amount: parseFloat(amount),
            description,
            type,
            category: selectedCat ? selectedCat.name : 'General',
            categoryId: parseInt(categoryId),
            date: initialData ? initialData.date : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            icon: type === 'income' ? <FaMoneyBillWave /> : <FaCreditCard />,
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#09090B] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-white/10 relative animate-fadeIn">
                <button onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-white transition">
                    <FaTimes size={18} />
                </button>

                <h2 className="text-xl font-bold text-white mb-6 tracking-tight">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type Toggle */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${type === 'expense' ? 'bg-red-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                            onClick={() => { setType('expense'); setCategoryId(''); }}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${type === 'income' ? 'bg-green-500 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                            onClick={() => { setType('income'); setCategoryId(''); }}
                        >
                            Income
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">ETB</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-14 text-white font-bold focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-zinc-500"
                                placeholder="0.00"
                                min="0" step="0.01"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-medium focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all placeholder-zinc-500"
                            placeholder="e.g. Nike Shoes"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5 ml-1">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(parseInt(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-medium focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all appearance-none"
                            disabled={loading}
                        >
                            {loading ? <option className="bg-[#09090B] text-zinc-400">Loading...</option> :
                                filteredCategories.map(cat => (
                                    <option className="bg-[#09090B] text-white" key={cat.id} value={cat.id}>{cat.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-200 hover:scale-[1.02] transition-all duration-200 mt-2">
                        Save Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
