import React, { createContext, useState, useContext, useEffect } from 'react';

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

            if (token) {
                try {
                    // verify token and get user data
                    const response = await fetch('https://yisehak.duckdns.org/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        // Token invalid/expired
                        logout();
                    }
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
            const response = await fetch('https://yisehak.duckdns.org/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

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
            const response = await fetch('https://yisehak.duckdns.org/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

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
