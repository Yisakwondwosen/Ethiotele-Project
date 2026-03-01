import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkAuth as apiCheckAuth, login as apiLogin, guestLogin as apiGuestLogin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Check for token in URL (from Fayda redirect)
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');
            let token = localStorage.getItem('token');

            if (urlToken) {
                token = urlToken;
                localStorage.setItem('token', token);
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            const guestId = localStorage.getItem('guestId');
            const guestUser = localStorage.getItem('guestUser');

            if (token && token !== 'undefined' && token !== 'null') {
                try {
                    // verify token and get user data
                    const userData = await apiCheckAuth();
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (err) {
                    console.error("Auth check failed", err);
                    logout();
                }
            } else if (guestId && guestUser) {
                setUser(JSON.parse(guestUser));
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await apiLogin(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const guestLogin = async (username) => {
        try {
            const data = await apiGuestLogin(username);

            if (data.token) localStorage.setItem('token', data.token);
            localStorage.setItem('guestId', data.id);
            localStorage.setItem('guestUser', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('guestId');
        localStorage.removeItem('guestUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, guestLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
