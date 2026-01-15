import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { FineService } from "../../services/fineService";
import type {Fine} from "../../types/fine";
import FineFormModal from "../../components/FineFormModal";

export default function FinesManage() {
    const [fines, setFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchFines = async () => {
        setLoading(true);
        try {
            const data = await FineService.getAll();
            // Sắp xếp mới nhất lên đầu
            setFines(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFines();
    }, []);

    // Helper
    const getBookInfo = (fine: Fine) => {
        return fine.bookLoan?.bookCopy.book.title || null;
    };

    const handleSettleFine = async (id: number) => { // id là number
        if (!window.confirm("Confirm payment received and remove this fine?")) return;
        try {
            await FineService.settleFine(id);
            alert("Fine settled successfully!");
            fetchFines();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to settle fine");
        }
    };

    const handleCreateFine = async (data: { username: string, amount: number, description: string, bookLoanId: string }) => {
        try {
            await FineService.create(data);
            alert("New fine created successfully!");
            fetchFines();
        } catch (error: any) {
            alert("Error: " + (error.response?.data?.message || "Failed to create fine"));
        }
    };

    const filteredFines = fines.filter(f =>
        f.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAmount = fines.reduce((sum, f) => sum + f.amount, 0);

    return (
        <>
            <title>Manage Fines</title>
            <AdminNavbar selected="fines" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-800">Fines Management</h2>
                            <p className="text-red-600 font-medium mt-1">
                                Total Outstanding: {totalAmount.toLocaleString()} VND
                            </p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search username, description..."
                                className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-full md:w-64 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md whitespace-nowrap"
                            >
                                + Create Fine
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-purple-100 text-purple-800 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Book / Loan Ref</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : filteredFines.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No active fines found.</td></tr>
                            ) : (
                                filteredFines.map(fine => {
                                    const bookTitle = getBookInfo(fine);
                                    return (
                                        <tr key={fine.id} className="hover:bg-purple-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-700">{fine.user.username}</td>
                                            <td className="px-6 py-4 font-mono font-medium text-red-600">
                                                {fine.amount.toLocaleString()} ₫
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{fine.description}</td>
                                            <td className="px-6 py-4">
                                                {bookTitle ? (
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800 line-clamp-1" title={bookTitle}>
                                                            {bookTitle}
                                                        </p>
                                                        {fine.bookLoan && <p className="text-xs text-gray-400 font-mono">Ref: {fine.bookLoan.id}</p>}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 font-mono italic">
                                                        Manual Fine
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(fine.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleSettleFine(fine.id)}
                                                    className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 shadow-sm transition-all flex items-center gap-1 ml-auto"
                                                >
                                                    <span>✓</span> Settle
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <FineFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateFine}
            />
        </>
    );
}