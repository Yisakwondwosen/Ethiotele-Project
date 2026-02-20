import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
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

export default api;
