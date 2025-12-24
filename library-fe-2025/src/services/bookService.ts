import booksData, {type Book } from '../data/books';

const BOOK_STORAGE_KEY = 'library_books';

const getStoredBooks = (): Book[] => {
    const stored = localStorage.getItem(BOOK_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Lần đầu chạy chưa có gì thì nạp dữ liệu mẫu vào
    localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(booksData));
    return booksData;
};

const bookService = {
    getAll: async (): Promise<Book[]> => {
        // Giả lập delay mạng 300ms cho giống thật
        await new Promise(resolve => setTimeout(resolve, 300));
        return getStoredBooks();
    },

    getById: async (id: number): Promise<Book | undefined> => {
        const books = getStoredBooks();
        return books.find(b => b.id === id);
    },

    search: async (term: string): Promise<Book[]> => {
        const books = getStoredBooks();
        const lowerTerm = term.toLowerCase();
        return books.filter(b =>
            b.title.toLowerCase().includes(lowerTerm) ||
            b.description.toLowerCase().includes(lowerTerm)
        );
    },

    create: async (bookData: Omit<Book, 'id'>): Promise<Book> => {
        const books = getStoredBooks();
        const newBook: Book = {
            ...bookData,
            id: Date.now(), // Tạo ID giả bằng timestamp
            rating: 0
        };
        const updatedBooks = [newBook, ...books];
        localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(updatedBooks));
        return newBook;
    },

    update: async (id: number, bookData: Partial<Book>): Promise<Book> => {
        const books = getStoredBooks();
        const index = books.findIndex(b => b.id === id);
        if (index === -1) throw new Error("Book not found");

        const updatedBook = { ...books[index], ...bookData };
        books[index] = updatedBook;

        localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
        return updatedBook;
    },

    // 3. Xóa sách
    delete: async (id: number): Promise<void> => {
        const books = getStoredBooks();
        const filteredBooks = books.filter(b => b.id !== id);
        localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(filteredBooks));
    }
};

export default bookService;