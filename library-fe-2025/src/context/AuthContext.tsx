import React, { createContext, useState, useEffect } from 'react';
import type {User, LoginCredentials, RegisterCredentials} from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Lỗi parse user từ storage", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const data = await authService.login(credentials);

            localStorage.setItem('token', data.token);

            const userInfo: User = {
                username: data.username,
                name: data.name,
                role: data.role,
                avatarUrl: data.avatarUrl,
                email: data.email,
                joinedDate: data.joinedDate
            };
            localStorage.setItem('user', JSON.stringify(userInfo));

            setUser(userInfo);
            setIsAuthenticated(true);

            return Promise.resolve();
        } catch (error: any) {
            console.error('Login failed:', error);
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                return Promise.reject("Tên đăng nhập hoặc mật khẩu không chính xác!");
            }
            return Promise.reject(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const data = await authService.register(credentials);
            localStorage.setItem('token', data.token);

            const userInfo: User = {
                username: data.username,
                name: data.name,
                role: data.role,
                avatarUrl: data.avatarUrl,
                email: data.email,
                joinedDate: data.joinedDate
            };
            localStorage.setItem('user', JSON.stringify(userInfo));

            setUser(userInfo);
            setIsAuthenticated(true);
            return Promise.resolve();
        } catch (error: any) {
            console.error('Register failed:', error);
            return Promise.reject(error.response?.data?.message || error.message || 'Đăng ký thất bại');
        }
    };

    const logout = () => {
        if (authService.logout) {
            authService.logout();
        }

        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, isLoading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};