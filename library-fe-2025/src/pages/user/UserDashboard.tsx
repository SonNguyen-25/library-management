import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import type { BookLoan } from '../../data/bookLoans';
import type { Fine } from '../../data/fines';
import type { Book } from '../../data/books';
import bookLoans from '../../data/bookLoans';
import fines from '../../data/fines';
import booksData from '../../data/books';
import authService from '../../services/authService';
import bookRequests, {type BookRequest} from "../../data/bookRequests.ts";
import BookCard from "../../components/BookCard.tsx";
import BookDetailModal from "../../components/BookDetailModal.tsx";

export default function UserDashboard() {
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [finesList, setFinesList] = useState<Fine[]>([]);
    const [requestsList, setRequestsList] = useState<BookRequest[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [username, setUsername] = useState('');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    useEffect(() => {
        const user = authService.getCurrentUser();
        const displayName = user?.name || 'Guest';
        const currentUser =user?.username;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsername(displayName);
        // LỌC BookLoans theo userUserName
        const userLoans = bookLoans.filter(
            loan => loan.userUserName === currentUser
        );

        // LỌC Fines theo username
        const userFines = fines.filter(
            fine => fine.username === currentUser
        );
        const userRequests = bookRequests.filter(
            userRequests => userRequests.username === currentUser
        );
        // Load mock data - show all for demo
        setLoans(userLoans);
        setFinesList(userFines);
        setRequestsList(userRequests)
        setBooks(booksData.slice(0, 4));
    }, []);
    
    const activeLoans = loans.filter(loan => loan.status === 'BORROWED').length;
    const pendingRequests = requestsList.filter(userRequests => userRequests.status === 'PENDING').length;
    const totalFines = finesList.reduce((sum, fine) => sum + fine.amount, 0);

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    const handleBorrowBook = (book: Book) => {
        alert(`Tính năng mượn sách "${book.title}" đang được phát triển. Vui lòng quay lại sau!`);
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
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-blue-700">Welcome, {username}!</h2>
                    <p className="text-gray-600 mt-2">
                        Here's an overview of your library account.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700">Active Loans</h3>
                                <p className="text-3xl font-bold text-blue-800 mt-2">{activeLoans}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <Link to="/user/fines" className="block mt-4 text-blue-600 hover:underline">View all fines →</Link>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Link to="/user/search" className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg flex items-center gap-3 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="font-medium">Search Books</span>
                        </Link>
                        <Link to="/user/profile" className="bg-green-100 hover:bg-green-200 p-4 rounded-lg flex items-center gap-3 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">Update Profile</span>
                        </Link>
                        <Link to="/user/loaned" className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg flex items-center gap-3 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="font-medium">Manage Loans</span>
                        </Link>
                    </div>
                </div>
                
                {soonDueBooks.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-orange-600 mb-4">Books Due Soon</h3>
                        <div className="space-y-4">
                            {soonDueBooks.map(loan => {
                                const dueDate = new Date(loan.dueDate);
                                const today = new Date();
                                const diffTime = dueDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                return (
                                    <div key={loan.id} className="flex justify-between items-center border-b pb-4">
                                        <div>
                                            <p className="font-medium">{loan.bookCopyOriginalBookTitle}</p>
                                            <p className="text-sm text-gray-600">Due: {new Date(loan.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            diffDays <= 2 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {diffDays} {diffDays === 1 ? 'day' : 'days'} left
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-blue-700">Books You Might Like</h3>
                        <Link to="/user/search" className="text-blue-600 hover:underline text-sm">
                            View all books →
                        </Link>
                    </div>
                    
                    {books.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No book recommendations available.</p>
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
                onBorrow={handleBorrowBook}
            />
        </>
    );
}
