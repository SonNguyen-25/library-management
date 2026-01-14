import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { requestService, type BookRequest } from "../../services/bookRequestService";

export default function RequestsManage() {
    const [requests, setRequests] = useState<BookRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("PENDING");

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await requestService.getAllRequestsAdmin();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (request: BookRequest) => {
        if (!window.confirm(`Accept request for "${request.book.title}"?`)) return;

        try {
            await requestService.processRequestAdmin(request.id, 'ACCEPTED');
            alert("Request Accepted & Loan Created!");
            fetchRequests();
        } catch (error: any) {
            const serverMessage = error.response?.data;
            const displayMsg = typeof serverMessage === 'string' ? serverMessage : (serverMessage?.message || error.message);

            alert("Không thể duyệt: " + displayMsg);
        }
    };

    const handleReject = async (id: number) => {
        if (!window.confirm("Deny this request?")) return;
        try {
            await requestService.processRequestAdmin(id, 'DENIED');
            fetchRequests();
        } catch (error: any) {
            alert("Error: " + error.message);
        }
    };

    const filteredRequests = requests.filter(r => filterStatus === "ALL" || r.status === filterStatus);

    const getStatusBadge = (status: string) => {
        const colors: any = {
            "PENDING": "bg-yellow-100 text-yellow-800",
            "ACCEPTED": "bg-green-100 text-green-800",
            "DENIED": "bg-red-100 text-red-800"
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
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
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Book Name</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No requests found.</td></tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-purple-50">
                                        <td className="px-6 py-4 text-gray-500">#{req.id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${req.type === 'BORROWING' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-purple-50 text-purple-600 border border-purple-200'}`}>
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            <div className="flex items-center gap-3">
                                                <img src={req.book.coverUrl} alt="" className="w-8 h-10 object-cover rounded shadow-sm"/>
                                                {req.book.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700">{req.user?.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {req.status === 'PENDING' && (
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