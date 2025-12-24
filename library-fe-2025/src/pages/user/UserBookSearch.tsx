import { useState, useEffect } from 'react';
import UserNavbar from '../../components/UserNavbar';
import BookCard from '../../components/BookCard';
import type { Book } from '../../data/books';
import authorsData from '../../data/authors';
import categoriesData from '../../data/categories';
import publishersData from '../../data/publishers';
import books from '../../data/books';
import BookDetailModal from "../../components/BookDetailModal.tsx";
const AUTHORS_STORAGE_KEY = 'library_authors';
const CATEGORIES_STORAGE_KEY = 'library_categories';
const PUBLISHERS_STORAGE_KEY = 'library_publishers';

export default function UserBookSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedAuthor, setSelectedAuthor] = useState<string>('');
    const [authors, setAuthors] = useState(authorsData);
    const [categories, setCategories] = useState(categoriesData);
    const [publishers, setPublishers] = useState(publishersData);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        // Load from localStorage or use default
        const storedAuthors = localStorage.getItem(AUTHORS_STORAGE_KEY);
        if (storedAuthors) {
            setAuthors(JSON.parse(storedAuthors));
        } else {
            localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify(authorsData));
        }
        
        const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
        } else {
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesData));
        }
        
        const storedPublishers = localStorage.getItem(PUBLISHERS_STORAGE_KEY);
        if (storedPublishers) {
            setPublishers(JSON.parse(storedPublishers));
        } else {
            localStorage.setItem(PUBLISHERS_STORAGE_KEY, JSON.stringify(publishersData));
        }
        
        setFilteredBooks(books);
    }, []);
    
    useEffect(() => {
        let results = [...books];
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            results = results.filter(book => 
                book.title.toLowerCase().includes(term) || 
                book.description?.toLowerCase().includes(term)
            );
        }
        
        if (selectedCategory) {
            const categoryId = parseInt(selectedCategory);
            results = results.filter(book => book.categoryIds.includes(categoryId));
        }
        
        if (selectedAuthor) {
            const authorId = parseInt(selectedAuthor);
            results = results.filter(book => book.authorIds.includes(authorId));
        }
        
        setFilteredBooks(results);
    }, [searchTerm, selectedCategory, selectedAuthor]);
    
    const handleBorrowBook = (book: Book) => {
        alert(`Tính năng mượn sách "${book.title}" đang được phát triển. Vui lòng quay lại sau!`);
    };

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    const handleSubcribeBook = (book: Book) => {
        alert(`Tính năng đăng kí sách "${book.title}" đang được phát triển. Vui lòng quay lại sau!`);
    };
    const getAuthorNames = (book: Book): string => {
        return book.authorIds
            .map(id => authors.find(a => a.id === id)?.name || 'Unknown')
            .join(', ');
    };

    const getCategoryNames = (book: Book): string => {
        return book.categoryIds
            .map(id => categories.find(c => c.id === id)?.name || 'Unknown')
            .join(', ');
    };

    const getPublisherName = (book: Book): string => {
        return publishers.find(p => p.id === book.publisherId)?.name || 'Unknown';
    };

    return (
        <>
            <title>Search Books</title>
            <UserNavbar selected="search" />
            
            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Search Books</h2>
                <p className="text-gray-700 mb-6">
                    Find books in our library and request to borrow them.
                </p>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search by title or description..."
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={selectedAuthor}
                                onChange={(e) => setSelectedAuthor(e.target.value)}
                            >
                                <option value="">All Authors</option>
                                {authors.map(author => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">
                        Results ({filteredBooks.length})
                    </h3>
                    
                    {filteredBooks.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">
                            No books found matching your search criteria.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {filteredBooks.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                                    <p className="text-gray-500">
                                        No books found matching your search criteria.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredBooks.map((book) => (
                                        <BookCard
                                            key={book.id}
                                            book={book}
                                            onBorrow={handleBorrowBook}
                                            onClick={handleBookClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <BookDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                book={selectedBook}
                onBorrow={handleBorrowBook}
            />
        </>
    );
}
