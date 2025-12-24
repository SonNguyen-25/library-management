import categoriesData, {type Category } from '../data/categories';

const STORAGE_KEY = 'library_categories';

const getStored = (): Category[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categoriesData));
    return categoriesData;
};

export const CategoryService = {
    getAll: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return getStored();
    },
    create: async (name: string) => {
        const items = getStored();
        // Tạo ID number giả lập
        const newItem = { id: Date.now(), name };
        const updated = [newItem, ...items];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newItem;
    },
    update: async (id: number, name: string) => {
        const items = getStored();
        const index = items.findIndex(i => i.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], name };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    },
    delete: async (id: number) => {
        const items = getStored();
        const filtered = items.filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
};