import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import { useAuth } from '../../hooks/useAuth';
import { bookService } from '../../services/bookService';
import type { Book } from '../../types/book';
import { bookLoanService, type BookLoan } from '../../services/bookLoanService';
import { FineService } from '../../services/fineService';
import type { Fine } from '../../types/fine';
import { requestService, type BookRequest } from '../../services/bookRequestService';
import BookCard from "../../components/BookCard";
import BookDetailModal from "../../components/BookDetailModal";

export default function UserDashboard() {
    const { user } = useAuth();
    // State
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [finesList, setFinesList] = useState<Fine[]>([]);
    const [requestsList, setRequestsList] = useState<BookRequest[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    // UI State
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = async () => {
        if (!user) return;
        setIsLoading(true);
        // Lấy Sách (Page 1, Size 4)
        try {
            const booksRes = await bookService.getPublicBooks(1, 4);
            if (booksRes && booksRes.data) {
                setBooks(booksRes.data);
            }
        } catch (e) {
            console.error("Lỗi load sách:", e);
        }
        // Lấy Loans
        try {
            const loansRes = await bookLoanService.getMyLoans();
            setLoans(loansRes);
        } catch (e) {
            console.error("Lỗi load loans:", e);
        }

        // Lấy Fines
        try {
            const finesRes = await FineService.getMyFines();
            setFinesList(finesRes);
        } catch (e) {
            console.error("Lỗi load fines:", e);
        }

        // Lấy Requests
        try {
            const requestsRes = await requestService.getMyRequests();
            setRequestsList(requestsRes);
        } catch (e) {
            console.error("Lỗi load requests:", e);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const activeLoans = loans.filter(loan => loan.status === 'BORROWED').length;
    const pendingRequests = requestsList.filter(req => req.status === 'PENDING').length;
    const totalFines = finesList.reduce((sum, fine) => sum + (fine.amount || 0), 0);

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    const handleBorrowBook = (book: Book) => {
        setSelectedBook(book);
        setIsDetailOpen(true);
    };

    // Sách sắp hết hạn
    const soonDueBooks = loans
        .filter(loan => {
            if (loan.status !== 'BORROWED') return false;
            const dueDate = new Date(loan.dueDate);
            const today = new Date();
            // Tính số ngày còn lại
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Lấy sách sắp hết hạn (<= 7 ngày) hoặc đã quá hạn
            return diffDays <= 7;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
        <>
            <title>Library Dashboard</title>
            <UserNavbar selected="home" />

            <div className="min-h-screen bg-blue-50 p-6">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-blue-700">Welcome, {user?.name || 'User'}!</h2>
                    <p className="text-gray-600 mt-2">Here's an overview of your library account.</p>
                </div>

                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading dashboard...</div>
                ) : (
                    <>
                        {/* STATS CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* LOANS */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-700">Active Loans</h3>
                                        <p className="text-3xl font-bold text-blue-800 mt-2">{activeLoans}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-2xl">📖</div>
                                </div>
                                <Link to="/user/loaned" className="block mt-4 text-blue-600 hover:underline">View all loans →</Link>
                            </div>

                            {/* REQUESTS */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-700">Pending Requests</h3>
                                        <p className="text-3xl font-bold text-blue-800 mt-2">{pendingRequests}</p>
                                    </div>
                                    <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 text-2xl">⏳</div>
                                </div>
                                <Link to="/user/requests" className="block mt-4 text-blue-600 hover:underline">View all requests →</Link>
                            </div>

                            {/* FINES */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-700">Outstanding Fines</h3>
                                        <p className="text-3xl font-bold text-red-600 mt-2">{totalFines.toLocaleString()} VND</p>
                                    </div>
                                    <div className="bg-red-100 p-3 rounded-full text-red-600 text-2xl">💸</div>
                                </div>
                                <Link to="/user/fines" className="block mt-4 text-blue-600 hover:underline">View all fines →</Link>
                            </div>
                        </div>

                        {/* SOON DUE BOOKS */}
                        {soonDueBooks.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-lg font-semibold text-orange-600 mb-4">Books Due Soon / Overdue</h3>
                                <div className="space-y-4">
                                    {soonDueBooks.map(loan => {
                                        const dueDate = new Date(loan.dueDate);
                                        const diffTime = dueDate.getTime() - new Date().getTime();
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        const bookTitle = loan.bookCopy?.book?.title || "Unknown Book";

                                        let statusColor = 'bg-orange-100 text-orange-800';
                                        let statusText = `${diffDays} days left`;

                                        if (diffDays < 0) {
                                            statusColor = 'bg-red-100 text-red-800';
                                            statusText = `Overdue ${Math.abs(diffDays)} days`;
                                        } else if (diffDays === 0) {
                                            statusColor = 'bg-red-100 text-red-800';
                                            statusText = 'Due today!';
                                        }

                                        return (
                                            <div key={loan.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                                                <div>
                                                    <p className="font-medium">{bookTitle}</p>
                                                    <p className="text-sm text-gray-600">Due: {dueDate.toLocaleDateString()}</p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                                                    {statusText}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* RECOMMENDED BOOKS */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-blue-700 mb-4">Books You Might Like</h3>
                            {books.length === 0 ? (
                                <p className="text-gray-500 text-center">No books found.</p>
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
                    </>
                )}
            </div>

            <BookDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                book={selectedBook}
                onUpdate={fetchDashboardData}
            />
        </>
    );
}