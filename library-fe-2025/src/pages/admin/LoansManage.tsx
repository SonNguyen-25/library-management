import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { bookLoanService, type BookLoan } from "../../services/bookLoanService";

export default function LoansManage() {
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const data = await bookLoanService.getAllLoansAdmin();
            setLoans(data);
        } catch (error) {
            console.error("Failed to load loans", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleReturnBook = async (id: number) => {
        if (!window.confirm("Confirm return for this book?")) return;
        try {
            await bookLoanService.returnBookAdmin(id);
            alert("Book returned successfully!");
            fetchLoans(); // Reload list
        } catch (error: any) {
            alert("Error: " + (error.response?.data?.message || "Failed to return book"));
        }
    };

    // Filter local
    const filteredLoans = loans.filter(loan =>
        loan.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.bookCopy.book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <title>Manage Loans</title>
            <AdminNavbar selected="loans" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-purple-800">Loans Management</h2>
                        <input
                            type="text"
                            placeholder="Search user or book..."
                            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-64"
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
                                <th className="px-6 py-4">Borrower</th>
                                <th className="px-6 py-4">Loan Date</th>
                                <th className="px-6 py-4">Return Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                            ) : filteredLoans.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No loans found.</td></tr>
                            ) : (
                                filteredLoans.map(loan => (
                                    <tr key={loan.id} className="hover:bg-purple-50">
                                        <td className="px-6 py-4 text-gray-500">#{loan.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {loan.bookCopy.book.title}
                                            <div className="text-xs text-gray-400">Copy ID: {loan.bookCopy.id}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700">{loan.user.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(loan.loanDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    loan.status === 'BORROWED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {loan.status}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {loan.status === 'BORROWED' && (
                                                <button
                                                    onClick={() => handleReturnBook(loan.id)}
                                                    className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 shadow-sm"
                                                >
                                                    Return
                                                </button>
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