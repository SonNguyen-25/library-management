import { useState } from 'react';
import UserNavbar from "../../components/UserNavbar";
import { BookRequestStatusEnum, BookRequestTypeEnum } from '../../data/bookRequests';
import bookRequests from '../../data/bookRequests';
import authService from "../../services/authService.ts";

const useAuth = () => {
    const user = authService.getCurrentUser();
    return user.username;
};
export default function UserRequest() {
    const currentUsername = useAuth();
    const [filterType, setFilterType] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const requests = bookRequests.filter(userRequest => userRequest.username === currentUsername);

    const filteredRequests = requests.filter(request => {
        const matchesType = filterType ? request.type === filterType : true;
        const matchesStatus = filterStatus ? request.status === filterStatus : true;
        return matchesType && matchesStatus;
    });

    const getStatusClass = (status: BookRequestStatusEnum) => {
        switch (status) {
            case BookRequestStatusEnum.ACCEPTED:
                return 'bg-green-100 text-green-800';
            case BookRequestStatusEnum.DENIED:
                return 'bg-red-100 text-red-800';
            case BookRequestStatusEnum.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeClass = (type: BookRequestTypeEnum) => {
        switch (type) {
            case BookRequestTypeEnum.BORROWING:
                return 'bg-blue-100 text-blue-800';
            case BookRequestTypeEnum.RETURNING:
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCancelRequest = () => {
        alert(`Tính năng hủy yêu cầu đang được phát triển. Vui lòng quay lại sau!`);
    };

    return (
        <>
            <title>My Requests</title>
            <UserNavbar selected="request"/>
            
            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Requests</h2>
                <p className="text-gray-700 mb-6">
                    View and track the status of your book borrowing and returning requests.
                </p>

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
                                    <option value={BookRequestTypeEnum.BORROWING}>Borrowing</option>
                                    <option value={BookRequestTypeEnum.RETURNING}>Returning</option>
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
                                    <option value={BookRequestStatusEnum.ACCEPTED}>Accepted</option>
                                    <option value={BookRequestStatusEnum.DENIED}>Denied</option>
                                    <option value={BookRequestStatusEnum.PENDING}>Pending</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {filteredRequests.length} of {requests.length} requests
                        </div>
                    </div>
                </div>

                {filteredRequests.length === 0 ? (
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
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeClass(request.type as BookRequestTypeEnum)}`}>
                                                {request.type}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status as BookRequestStatusEnum)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-sm">
                                            <span className="font-medium">Book Loan ID:</span> {request.bookLoanId}
                                        </p>
                                        {request.bookName && (
                                            <p className="text-sm">
                                                <span className="font-medium">Book:</span> {request.bookName}
                                            </p>
                                        )}
                                        <p className="text-sm">
                                            <span className="font-medium">Requested:</span> {new Date(request.createdAt).toLocaleString()}
                                        </p>
                                        
                                        {request.updatedAt !== request.createdAt && (
                                            <p className="text-sm">
                                                <span className="font-medium">Last Updated:</span> {new Date(request.updatedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        {request.status === BookRequestStatusEnum.PENDING && (
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                                                onClick={handleCancelRequest}
                                            >
                                                Cancel Request
                                            </button>
                                        )}
                                        
                                        {request.status === BookRequestStatusEnum.PENDING && (
                                            <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 mt-2">
                                                This request is pending approval from the library staff.
                                            </div>
                                        )}
                                        {request.status === BookRequestStatusEnum.ACCEPTED && (
                                            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                                {request.type === BookRequestTypeEnum.BORROWING 
                                                    ? 'Your borrowing request has been approved. You can pick up the book at the library.'
                                                    : 'Your return request has been approved. Please return the book to the library.'}
                                            </div>
                                        )}
                                        {request.status === BookRequestStatusEnum.DENIED && (
                                            <div className="px-4 py-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                                Your request has been denied. Please contact the library for more information.
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
