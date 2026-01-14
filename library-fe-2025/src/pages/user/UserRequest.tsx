import { useState, useEffect } from 'react';
import UserNavbar from "../../components/UserNavbar";
import { requestService, type BookRequest } from '../../services/bookRequestService';

export default function UserRequest() {
    const [requests, setRequests] = useState<BookRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    const fetchRequests = async () => {
        try {
            const data = await requestService.getMyRequests();
            // Sắp xếp: Mới nhất lên đầu
            setRequests(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error("Lỗi tải requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleCancelRequest = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn hủy yêu cầu này không?")) {
            try {
                await requestService.cancelRequest(id);
                alert("Đã hủy yêu cầu thành công!");
                fetchRequests();
            } catch (error: any) {
                alert("Lỗi: " + (error.response?.data?.message || "Không thể hủy yêu cầu"));
            }
        }
    };

    const filteredRequests = requests.filter(request => {
        const matchesType = filterType ? request.type === filterType : true;
        const matchesStatus = filterStatus ? request.status === filterStatus : true;
        return matchesType && matchesStatus;
    });

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-100 text-green-800';
            case 'DENIED': return 'bg-red-100 text-red-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeClass = (type: string) => {
        switch (type) {
            case 'BORROWING': return 'bg-blue-100 text-blue-800';
            case 'RETURNING': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <title>My Requests</title>
            <UserNavbar selected="requests"/>

            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Requests</h2>
                <p className="text-gray-700 mb-6">
                    View and track the status of your book borrowing and returning requests.
                </p>

                {/* FILTER SECTION */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3 sm:mb-0">
                            <div>
                                <span className="font-medium text-gray-700 mr-2">Type:</span>
                                <select
                                    className="border border-gray-300 rounded px-3 py-1"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="BORROWING">Borrowing</option>
                                    <option value="RETURNING">Returning</option>
                                </select>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 mr-2">Status:</span>
                                <select
                                    className="border border-gray-300 rounded px-3 py-1"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="ACCEPTED">Accepted</option>
                                    <option value="DENIED">Denied</option>
                                    <option value="PENDING">Pending</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {filteredRequests.length} of {requests.length} requests
                        </div>
                    </div>
                </div>

                {/* LIST SECTION */}
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <p className="text-gray-500">
                            You have no requests{filterType || filterStatus ? ' matching the selected filters' : ''}.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map(request => (
                            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeClass(request.type)}`}>
                                                {request.type}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-sm">
                                            <span className="font-medium">Request ID:</span> #{request.id}
                                        </p>
                                        {request.book && (
                                            <p className="text-sm flex items-center gap-2 mt-1">
                                                <span className="font-medium">Book:</span>
                                                <img src={request.book.coverUrl} className="w-6 h-8 object-cover rounded border" alt="" />
                                                {request.book.title}
                                            </p>
                                        )}
                                        <p className="text-sm mt-1">
                                            <span className="font-medium">Requested:</span> {new Date(request.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* CỘT PHẢI: ACTIONS & MESSAGES */}
                                    <div className="mt-4 md:mt-0 md:text-right max-w-md">
                                        {request.status === 'PENDING' && (
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-colors text-sm font-medium"
                                                onClick={() => handleCancelRequest(request.id)}
                                            >
                                                Cancel Request
                                            </button>
                                        )}

                                        {request.status === 'PENDING' && (
                                            <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 mt-2 text-left">
                                                This request is pending approval from the library staff.
                                            </div>
                                        )}
                                        {request.status === 'ACCEPTED' && (
                                            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded text-sm text-green-800 text-left">
                                                {request.type === 'BORROWING'
                                                    ? 'Your borrowing request has been approved. You can pick up the book at the library.'
                                                    : 'Your return request has been approved.'}
                                            </div>
                                        )}
                                        {request.status === 'DENIED' && (
                                            <div className="px-4 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-800 text-left">
                                                Your request has been denied.
                                            </div>
                                        )}
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