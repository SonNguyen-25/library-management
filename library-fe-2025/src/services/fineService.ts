import finesData, {type Fine } from '../data/fines';
import usersData from '../data/users';

const FINE_STORAGE_KEY = 'library_fines';
const USER_STORAGE_KEY = 'library_users';

const getStoredFines = (): Fine[] => {
    const stored = localStorage.getItem(FINE_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(FINE_STORAGE_KEY, JSON.stringify(finesData));
    return finesData;
};

const getStoredUsers = () => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : usersData;
};

export const FineService = {
    getAll: async (): Promise<Fine[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return getStoredFines();
    },

    getByUser: async (username: string): Promise<Fine[]> => {
        const fines = getStoredFines();
        return fines.filter(f => f.username === username);
    },

    create: async (fineData: { username: string, amount: number, description: string, bookLoanId: string }): Promise<Fine> => {
        const users = getStoredUsers();
        const userExists = users.find((u: any) => u.username === fineData.username);

        if (!userExists) {
            throw new Error(`Username "${fineData.username}" does not exist in the system!`);
        }

        const fines = getStoredFines();
        const now = new Date().toISOString();

        const newFine: Fine = {
            id: `fine-${Date.now()}`,
            ...fineData,
            createdAt: now,
            updatedAt: now
        };

        const updatedFines = [newFine, ...fines];
        localStorage.setItem(FINE_STORAGE_KEY, JSON.stringify(updatedFines));
        return newFine;
    },

    settleFine: async (id: string): Promise<void> => {
        const fines = getStoredFines();
        const filteredFines = fines.filter(f => f.id !== id);
        localStorage.setItem(FINE_STORAGE_KEY, JSON.stringify(filteredFines));
    }
};