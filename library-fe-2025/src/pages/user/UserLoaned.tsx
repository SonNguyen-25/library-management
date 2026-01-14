import { useState, useEffect } from 'react';
import UserNavbar from '../../components/UserNavbar';
import { bookLoanService, type BookLoan } from '../../services/bookLoanService';

export default function UserLoaned() {
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [loading, setLoading] = useState(true);
    // State Filter
    const [filterStatus, setFilterStatus] = useState<string>(''); // Mặc định là '' (All)

    const fetchLoans = async () => {
        setLoading(true);
        try {
            // Call API kèm filterStatus hiện tại
            const data = await bookLoanService.getMyLoans(filterStatus);
            setLoans(data);
        } catch (error) {
            console.error("Lỗi tải danh sách mượn:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLoans();
    }, [filterStatus]);

    // Helper Styles
    const getStatusClass = (status: string, dueDateStr: string) => {
        if (status === 'RETURNED') return 'bg-gray-100 text-gray-800';
        const isOverdue = new Date(dueDateStr) < new Date();
        if (isOverdue) return 'bg-red-100 text-red-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusLabel = (status: string, dueDateStr: string) => {
        if (status === 'RETURNED') return 'Returned';
        const isOverdue = new Date(dueDateStr) < new Date();
        return isOverdue ? 'Overdue' : 'Borrowed';
    };

    return (
        <>
            <title>My Loans</title>
            <UserNavbar selected="loaned" />

            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Loans</h2>

                {/* FILTER BOX */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center mb-3 sm:mb-0">
                            <span className="font-medium text-gray-700 mr-2">Status:</span>
                            <select
                                className="border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="BORROWED">Active (Borrowed)</option>
                                <option value="RETURNED">Returned</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {loans.length} records
                        </div>
                    </div>
                </div>

                {/* LIST */}
                {loading ? (
                    <div className="text-center py-10">Loading loans...</div>
                ) : loans.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <p className="text-gray-500">
                            {filterStatus ? 'No loans found with this status.' : 'You have no book loan history.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {loans.map(loan => (
                            <div key={loan.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(loan.status, loan.dueDate)}`}>
                                                {getStatusLabel(loan.status, loan.dueDate)}
                                            </span>
                                            <span className="text-gray-400 text-xs ml-3">ID: #{loan.id}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                                            {loan.bookCopy.book.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Copy ID: <span className="font-mono">{loan.bookCopy.id}</span>
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                            <p><span className="font-medium">Loan Date:</span> {new Date(loan.loanDate).toLocaleDateString()}</p>
                                            <p><span className="font-medium">Due Date:</span> {new Date(loan.dueDate).toLocaleDateString()}</p>
                                            {loan.returnDate && (
                                                <p><span className="font-medium">Returned:</span> {new Date(loan.returnDate).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 hidden md:block">
                                        <img
                                            src={loan.bookCopy.book.coverUrl}
                                            alt=""
                                            className="w-16 h-24 object-cover rounded shadow-sm border border-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}