import axiosClient from '../api/axiosClient';
import type {LoginCredentials, RegisterCredentials, AuthResponse} from '../types/auth';

export const authService = {
    login: async (credentials: LoginCredentials) => {
        // POST http://localhost:8080/api/v1/auth/login
        const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (credentials: RegisterCredentials) => {
        // POST http://localhost:8080/api/v1/auth/register
        const response = await axiosClient.post<AuthResponse>('/auth/register', credentials);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};