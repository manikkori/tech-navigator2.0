// AuthContext.jsx ke andar
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // STARTING ME HI LOCALSTORAGE SE TOKEN NIKALO
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    // Jab bhi token change ho, user ki details backend se fetch karo
    useEffect(() => {
        if (token) {
            // Token ko har aage ki request ke liye default set kar do
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Backend se user data manga lo (agar tumhara koi /api/auth/me route hai)
            // Warna user data ko bhi localStorage me stringify karke rakh sakte ho.
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
