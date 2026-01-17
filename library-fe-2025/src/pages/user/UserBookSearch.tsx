import { useState, useEffect } from 'react';
import UserNavbar from '../../components/UserNavbar';
import BookCard from '../../components/BookCard';
import BookDetailModal from '../../components/BookDetailModal';
import { bookService, type Author, type Category } from '../../services/bookService';
import type {Book} from '../../types/book';

export default function UserBookSearch() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // State Filter Data
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // State Search Params
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState<number | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [authData, catData] = await Promise.all([
                    bookService.getAuthors(),
                    bookService.getCategories()
                ]);
                setAuthors(authData);
                setCategories(catData);
            } catch (err) {
                console.error("Lỗi load filter:", err);
            }
        };
        fetchFilters();
    }, []);

    // Debounce Search Text
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Gọi API Search khi bất kỳ điều kiện nào thay đổi
    const fetchBooksData = async () => {
        setLoading(true);
        try {
            const data = await bookService.getPublicBooks(page, 12, debouncedSearch, selectedAuthor, selectedCategory);
            setBooks(data.data);
            setTotalPages(data.totalPages);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchBooksData();
    }, [page, debouncedSearch, selectedAuthor, selectedCategory]);

    // Handler reset
    const handleClearFilter = () => {
        setSearchTerm('');
        setSelectedAuthor(undefined);
        setSelectedCategory(undefined);
        setPage(1);
    }

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    const handleBorrowBook = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    return (
        <>
            <title>Search Books</title>
            <UserNavbar selected="search" />

            <div className="min-h-screen bg-blue-50 p-6">
                <div className="max-w-7xl mx-auto">

                    {/* SEARCH & FILTER */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Your Next Book</h2>

                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Input Search */}
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                            </div>

                            {/* Dropdown Author */}
                            <select
                                className="w-full md:w-48 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedAuthor || ''}
                                onChange={(e) => {
                                    setSelectedAuthor(e.target.value ? Number(e.target.value) : undefined);
                                    setPage(1); //reset về trang 1 khi lọc
                                }}
                            >
                                <option value="">All Authors</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>

                            {/* Dropdown Category */}
                            <select
                                className="w-full md:w-48 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedCategory || ''}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value ? Number(e.target.value) : undefined);
                                    setPage(1);
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>

                            {/* Button Clear */}
                            <button
                                onClick={handleClearFilter}
                                className="px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg whitespace-nowrap"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* RESULTS */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white h-96 rounded-lg shadow-sm animate-pulse"></div>
                            ))}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-xl">No books found matching your criteria.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                                {books.map(book => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        onClick={handleBookClick}
                                        onBorrow={handleBorrowBook}
                                    />
                                ))}
                            </div>

                            {/* PAGINATION */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-2 pb-8">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className={`px-4 py-2 rounded-lg border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-200'}`}
                                    >
                                        &larr; Previous
                                    </button>
                                    <span className="px-4 py-2 font-medium text-gray-700">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className={`px-4 py-2 rounded-lg border ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-200'}`}
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <BookDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                book={selectedBook}
                onUpdate={fetchBooksData}
            />
        </>
    );
}