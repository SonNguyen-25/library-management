// Định nghĩa Role khớp với Backend
export type Role = 'USER' | 'SUPER_ADMIN' | 'LIBRARY_MANAGER' | 'USER_MANAGER' | 'CIRCULATION_MANAGER';

// Interface cho dữ liệu User (để lưu vào State/LocalStorage)
export interface User {
    username: string;
    name: string;
    email?: string;
    joinedDate?: string;
    role: Role;
    avatarUrl: string;
}

// Interface cho phản hồi từ API Login/Register (Backend trả về)
export interface AuthResponse {
    token: string;
    username: string;
    name: string;
    role: Role;
    email: string;
    joinedDate: string;
    avatarUrl: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
    name: string;
    email: string;
}