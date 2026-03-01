import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const guestId = localStorage.getItem('guestId');
    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (guestId) {
        // Fallback for MVP No-Auth requirement
        config.headers['x-guest-id'] = guestId;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
};

export const deleteUserProfile = async () => {
    const response = await api.delete('/auth/me');
    return response.data;
};

export const getTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/transactions/categories');
    return response.data;
};

export const getTransactionSummary = async () => {
    const response = await api.get('/transactions/summary');
    return response.data;
};

export const createTransaction = async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
};

export const updateTransaction = async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
};

export const deleteTransaction = async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
};

export const getMonthlyReport = async (userId, month, year) => {
    const response = await api.get('/reports/monthly', { params: { userId, month, year } });
    return response.data;
};

// Notification APIs
export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsRead = async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
};

export const payForAiInsights = async () => {
    const response = await api.post('/telebirr/ai/pay');
    return response.data;
};

export const topUpTelebirr = async (amount, phoneNumber) => {
    const response = await api.post('/telebirr/pay', { amount, phoneNumber });
    return response.data;
};

export const generateAiInsights = async (prompt, apiKey) => {
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
    return response.data;
};

export const checkAuth = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const guestLogin = async (username) => {
    const response = await api.post('/profile', { username });
    return response.data;
};

export default api;
