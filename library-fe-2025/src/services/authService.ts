const MOCK_USERS = [
    { id: '1', username: 'johndoe', password: 'password', name: 'John Doe', role: 'USER' },
    { id: '2', username: 'janedoe', password: 'password', name: 'Jane Doe', role: 'USER' },

    { id: '99', username: 'admin', password: 'password', name: 'Super Admin', role: 'ADMIN' },
];

const CURRENT_USER_KEY = 'library_current_user';

const authService = {
    login: async (username: string, password: string): Promise<boolean> => {
        const user = MOCK_USERS.find(
            (u) =>
                u.username.toLowerCase() === username.toLowerCase().trim() &&
                u.password === password.trim()
        );

        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return true;
        }
        return false;
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: () => {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    isAuthenticated: async (): Promise<boolean> => {
        return Boolean(localStorage.getItem(CURRENT_USER_KEY));
    },

    isAdmin: (): boolean => {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (!stored) return false;
        const user = JSON.parse(stored);
        return user.role === 'ADMIN';
    },

    getCurrentUsername: (): string => {
        const user = authService.getCurrentUser();
        return user?.name || 'Guest';
    },

    getCurrentUserId: (): string | null => {
        const user = authService.getCurrentUser();
        return user?.id || null;
    },
};

export default authService;