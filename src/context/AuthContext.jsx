import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Initial load par browser ki memory (localStorage) se data uthana
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    
    // User data ko bhi string se wapas JSON me convert karke nikalna
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // 2. Token jab bhi mile, usko Axios headers me set kar dena
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // 3. Perfect Login Function (Memory me permanently save karne ke liye)
    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    // 4. Perfect Logout Function (Memory saaf karne ke liye)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, setToken, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
