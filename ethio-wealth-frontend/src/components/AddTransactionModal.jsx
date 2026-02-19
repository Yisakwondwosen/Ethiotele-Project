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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-fadeIn">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-bold text-brand-dark mb-6">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Toggle */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${type === 'expense' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-400'}`}
                            onClick={() => { setType('expense'); setCategoryId(''); }}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${type === 'income' ? 'bg-white text-green-500 shadow-sm' : 'text-gray-400'}`}
                            onClick={() => { setType('income'); setCategoryId(''); }}
                        >
                            Income
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-brand-dark font-bold">ETB</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 pl-14 text-brand-dark font-bold focus:outline-none focus:ring-2 focus:ring-brand-purple"
                                placeholder="0.00"
                                min="0" step="0.01"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            placeholder="e.g. Nike Shoes"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(parseInt(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            disabled={loading}
                        >
                            {loading ? <option>Loading...</option> :
                                filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl shadow-glow hover:opacity-90 transition mt-4">
                        Save Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
