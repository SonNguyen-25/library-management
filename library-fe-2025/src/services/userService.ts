import usersData, {type User } from '../data/users';

const USER_STORAGE_KEY = 'library_users';

// Helper lấy data
const getStoredUsers = (): User[] => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usersData));
    return usersData;
};

const userService = {
    getAll: async (): Promise<User[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return getStoredUsers();
    },

    create: async (userData: Omit<User, 'id' | 'joinedDate' | 'avatarUrl'>): Promise<User> => {
        const users = getStoredUsers();

        if (users.some(u => u.username === userData.username)) {
            throw new Error("Username already exists!");
        }

        const newUser: User = {
            ...userData,
            id: Date.now().toString(),
            joinedDate: new Date().toISOString(),
            avatarUrl: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
            status: userData.status || 'Active'
        };

        const updatedUsers = [newUser, ...users];
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUsers));
        return newUser;
    },

    update: async (id: string, userData: Partial<User>): Promise<User> => {
        const users = getStoredUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) throw new Error("User not found");

        const updatedUser = { ...users[index], ...userData };
        users[index] = updatedUser;

        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
        return updatedUser;
    },

    delete: async (id: string): Promise<void> => {
        const users = getStoredUsers();
        // Không cho xóa chính mình (giả lập logic, không thể xóa Super Admin)
        if (id === '99') throw new Error("Cannot delete Super Admin!");

        const filteredUsers = users.filter(u => u.id !== id);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(filteredUsers));
    }
};

export default userService;