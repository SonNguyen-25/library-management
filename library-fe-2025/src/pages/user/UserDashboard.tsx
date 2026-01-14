import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import { useAuth } from '../../hooks/useAuth';
import type { BookLoan } from '../../data/bookLoans';
import type { Fine } from '../../data/fines';
import bookLoans from '../../data/bookLoans';
import fines from '../../data/fines';
import bookRequests, { type BookRequest } from "../../data/bookRequests";
import { bookService } from '../../services/bookService'; // Service mới
import type {Book} from '../../types/book';
import BookCard from "../../components/BookCard";
import BookDetailModal from "../../components/BookDetailModal";

export default function UserDashboard() {
    const { user } = useAuth();
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [finesList, setFinesList] = useState<Fine[]>([]);
    const [requestsList, setRequestsList] = useState<BookRequest[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const currentUsername = user.username;

            const userLoans = bookLoans.filter(loan => loan.userUserName === currentUsername);
            const userFines = fines.filter(fine => fine.username === currentUsername);
            const userRequests = bookRequests.filter(req => req.username === currentUsername);

            setLoans(userLoans);
            setFinesList(userFines);
            setRequestsList(userRequests);

            // Gọi API lấy 4 cuốn sách đầu tiên để hiển thị ở Dashboard
            const fetchRecommendedBooks = async () => {
                try {
                    // page=1, size=4
                    const data = await bookService.getPublicBooks(1, 4);
                    setBooks(data.data);
                } catch (error) {
                    console.error("Failed to load books", error);
                }
            };
            fetchRecommendedBooks();
        }
    }, [user]);

    const activeLoans = loans.filter(loan => loan.status === 'BORROWED').length;
    const pendingRequests = requestsList.filter(req => req.status === 'PENDING').length;
    const totalFines = finesList.reduce((sum, fine) => sum + fine.amount, 0);

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    const handleBorrowBook = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    const soonDueBooks = loans
        .filter(loan => {
            if (loan.status !== 'BORROWED') return false;
            const dueDate = new Date(loan.dueDate);
            const today = new Date();
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
        <>
            <title>Library Dashboard</title>
            <UserNavbar selected="home" />

            <div className="min-h-screen bg-blue-50 p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-blue-700">Welcome, {user?.name || 'Guest'}!</h2>
                    <p className="text-gray-600 mt-2">
                        Here's an overview of your library account.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700">Active Loans</h3>
                                <p className="text-3xl font-bold text-blue-800 mt-2">{activeLoans}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                {/* Icon Book */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                        <Link to="/user/loaned" className="block mt-4 text-blue-600 hover:underline">View all loans →</Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700">Pending Requests</h3>
                                <p className="text-3xl font-bold text-blue-800 mt-2">{pendingRequests}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                {/* Icon Pending */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <Link to="/user/requests" className="block mt-4 text-blue-600 hover:underline">View all requests →</Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700">Outstanding Fines</h3>
                                <p className="text-3xl font-bold text-red-600 mt-2">{totalFines.toLocaleString()} VND</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                {/* Icon Fines */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <Link to="/user/fines" className="block mt-4 text-blue-600 hover:underline">View all fines →</Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link to="/user/search" className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg flex items-center gap-3 transition">
                            <span className="font-medium">🔍 Search Books</span>
                        </Link>
                        <Link to="/user/profile" className="bg-green-100 hover:bg-green-200 p-4 rounded-lg flex items-center gap-3 transition">
                            <span className="font-medium">👤 Update Profile</span>
                        </Link>
                        <Link to="/user/loaned" className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg flex items-center gap-3 transition">
                            <span className="font-medium">📚 Manage Loans</span>
                        </Link>
                    </div>
                </div>

                {/* Soon Due Books */}
                {soonDueBooks.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-orange-600 mb-4">Books Due Soon</h3>
                        <div className="space-y-4">
                            {soonDueBooks.map(loan => {
                                const dueDate = new Date(loan.dueDate);
                                const diffDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                return (
                                    <div key={loan.id} className="flex justify-between items-center border-b pb-4">
                                        <div>
                                            <p className="font-medium">{loan.bookCopyOriginalBookTitle}</p>
                                            <p className="text-sm text-gray-600">Due: {dueDate.toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${diffDays <= 2 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {diffDays} {diffDays === 1 ? 'day' : 'days'} left
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* BOOKS suggest*/}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-blue-700">Books You Might Like</h3>
                        <Link to="/user/search" className="text-blue-600 hover:underline text-sm">
                            View all books →
                        </Link>
                    </div>

                    {books.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                            Loading books...
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {books.map(book => (
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
            </div>

            <BookDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                book={selectedBook}
            />
        </>
    );
}