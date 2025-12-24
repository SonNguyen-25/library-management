import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { BookLoanService } from "../../services/bookLoanService";
import type {BookLoan, LoanStatus} from "../../data/bookLoans";
import bookCopies from "../../data/bookCopies";

export default function LoansManage() {
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLoans = async () => {
        setLoading(true);
        const data = await BookLoanService.getAll();

        setLoans(data.sort((a, b) => {
            const isActiveA = a.status === 'BORROWED';
            const isActiveB = b.status === 'BORROWED';

            if (isActiveA && !isActiveB) return -1;
            if (!isActiveA && isActiveB) return 1;

            return new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime();
        }));
        setLoading(false);
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleReturnBook = async (loan: BookLoan) => {
        if (!window.confirm(`Confirm return for book "${loan.bookCopyOriginalBookTitle}"?`)) return;

        try {
            await BookLoanService.returnBook(loan.id);

            // Cập nhật kho
            const copy = bookCopies.find(c => c.id === loan.bookCopyId);
            if (copy) {
                copy.status = "AVAILABLE";
            }

            alert("Book returned successfully!");
            fetchLoans();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const filteredLoans = loans.filter(l =>
        l.userUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.bookCopyOriginalBookTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: LoanStatus) => {
        const colors: Record<string, string> = {
            BORROWED: "bg-blue-100 text-blue-800",
            RETURNED: "bg-gray-100 text-gray-800",
            REJECTED: "bg-red-100 text-red-800",
            NONRETURNABLE: "bg-red-200 text-red-900",
            REQUEST_BORROWING: "bg-yellow-100 text-yellow-800",
            REQUEST_RETURNING: "bg-purple-100 text-purple-800"
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || "bg-gray-100"}`}>{status}</span>;
    };

    return (
        <>
            <title>Manage Loans</title>
            <AdminNavbar selected="loans" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-purple-800">Book Loans Management</h2>
                        <input
                            type="text"
                            placeholder="Search by user or book..."
                            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-purple-100 text-purple-800 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Book Title</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Loan Date</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : filteredLoans.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No loans found.</td></tr>
                            ) : (
                                filteredLoans.map(loan => (
                                    <tr key={loan.id} className="hover:bg-purple-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">#{loan.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{loan.bookCopyOriginalBookTitle}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">{loan.userUserName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(loan.loanDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(loan.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{getStatusBadge(loan.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {loan.status === 'BORROWED' && (
                                                <button
                                                    onClick={() => handleReturnBook(loan)}
                                                    className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded hover:bg-indigo-600 shadow-sm transition-all"
                                                >
                                                    Return Book
                                                </button>
                                            )}
                                            {loan.status === 'RETURNED' && (
                                                <span className="text-xs text-gray-400 italic">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}