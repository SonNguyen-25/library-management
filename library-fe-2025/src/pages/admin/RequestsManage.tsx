import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import bookRequestService from "../../services/bookRequestService";
import {
    type BookRequest,
    BookRequestStatusEnum,
    BookRequestTypeEnum
} from "../../data/bookRequests";
import { BookLoanService } from "../../services/bookLoanService";
import bookCopies from "../../data/bookCopies";
import booksData from "../../data/books";

export default function RequestsManage() {
    const [requests, setRequests] = useState<BookRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("PENDING");

    const fetchRequests = async () => {
        setLoading(true);
        const data = await bookRequestService.getAll();
        setRequests(data.sort((a, b) => {
            if (a.status === BookRequestStatusEnum.PENDING && b.status !== BookRequestStatusEnum.PENDING) return -1;
            if (a.status !== BookRequestStatusEnum.PENDING && b.status === BookRequestStatusEnum.PENDING) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }));
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (request: BookRequest) => {
        if (!window.confirm(`Accept ${request.type} request for "${request.bookName}"?`)) return;

        try {
            if (request.type === BookRequestTypeEnum.BORROWING) {
                // Tìm sách từ tên
                const book = booksData.find(b => b.title === request.bookName);
                if (!book) { alert("Book not found!"); return; }

                // Tìm bản sao AVAILABLE
                const availableCopy = bookCopies.find(c => c.bookId === book.id && c.status === "AVAILABLE");
                if (!availableCopy) { alert("No copies available!"); return; }

                // Tạo phiếu mượn
                await BookLoanService.create({
                    userUserName: request.username,
                    bookCopyId: availableCopy.id,
                    bookCopyOriginalBookTitle: request.bookName
                });

                availableCopy.status = "BORROWED";

            } else if (request.type === BookRequestTypeEnum.RETURNING) {
                await BookLoanService.returnBook(request.bookLoanId);
            }

            await bookRequestService.updateStatus(request.id, BookRequestStatusEnum.ACCEPTED);

            alert(`Request Accepted!`);
            fetchRequests();

        } catch (error: any) {
            alert("Error: " + error.message);
        }
    };
    const handleReject = async (id: string) => {
        if (!window.confirm("Deny this request?")) return;
        try {
            await bookRequestService.updateStatus(id, BookRequestStatusEnum.DENIED);
            fetchRequests();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const filteredRequests = requests.filter(r => filterStatus === "ALL" || r.status === filterStatus);

    const getStatusBadge = (status: BookRequestStatusEnum) => {
        const colors = {
            [BookRequestStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
            [BookRequestStatusEnum.ACCEPTED]: "bg-green-100 text-green-800",
            [BookRequestStatusEnum.DENIED]: "bg-red-100 text-red-800"
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status]}`}>{status}</span>;
    };

    const getTypeBadge = (type: BookRequestTypeEnum) => {
        return type === BookRequestTypeEnum.BORROWING
            ? <span className="text-blue-600 font-bold text-xs uppercase border border-blue-200 px-2 py-0.5 rounded bg-blue-50">Borrowing</span>
            : <span className="text-purple-600 font-bold text-xs uppercase border border-purple-200 px-2 py-0.5 rounded bg-purple-50">Returning</span>;
    };

    return (
        <>
            <title>Manage Requests</title>
            <AdminNavbar selected="requests" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-purple-800">Requests Management</h2>
                        <select
                            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="PENDING">Pending Only</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="DENIED">Denied</option>
                            <option value="ALL">All Requests</option>
                        </select>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-purple-100 text-purple-800 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Book Name</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No requests found.</td></tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-purple-50">
                                        <td className="px-6 py-4">{getTypeBadge(req.type)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{req.bookName}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700">{req.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {req.status === BookRequestStatusEnum.PENDING && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req)}
                                                        className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 shadow-sm"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.id)}
                                                        className="px-3 py-1 bg-red-400 text-white text-xs font-bold rounded hover:bg-red-500 shadow-sm"
                                                    >
                                                        Deny
                                                    </button>
                                                </div>
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