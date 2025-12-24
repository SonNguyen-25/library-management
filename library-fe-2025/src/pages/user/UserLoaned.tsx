import { useState } from 'react';
import UserNavbar from '../../components/UserNavbar';
import type { BookLoan } from '../../data/bookLoans';
import bookLoans from '../../data/bookLoans';
import authService from "../../services/authService.ts";

const useAuth = () => {
    const user = authService.getCurrentUser();
    return user.username;
};
export default function UserLoaned() {
    const currentUsername = useAuth();
    const [filterStatus, setFilterStatus] = useState<string>('');
    const loans = bookLoans.filter(loan => loan.userUserName === currentUsername); // Show sample data
    
    const filteredLoans = loans.filter(loan => 
        filterStatus ? loan.status === filterStatus : true
    );
    
    const handleRequestReturn = (loan: BookLoan) => {
        alert(`Tính năng trả sách "${loan.bookCopyOriginalBookTitle}" đang được phát triển. Vui lòng quay lại sau!`);
    };
    
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'BORROWED':
                return 'bg-green-100 text-green-800';
            case 'RETURNED':
                return 'bg-gray-100 text-gray-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'NONRETURNABLE':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getDaysRemaining = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return <span className="text-red-600 font-semibold">{Math.abs(diffDays)} days overdue</span>;
        }
        
        return <span className="text-green-600 font-semibold">{diffDays} days remaining</span>;
    };
    
    return (
        <>
            <title>My Loaned Books</title>
            <UserNavbar selected="loan" />
            
            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Loaned Books</h2>
                <p className="text-gray-700 mb-6">
                    View your current and past book loans.
                </p>
                
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="mb-3 sm:mb-0">
                            <span className="font-medium text-gray-700 mr-2">Filter by status:</span>
                            <select 
                                className="border border-gray-300 rounded px-3 py-1"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="BORROWED">Borrowed</option>
                                <option value="RETURNED">Returned</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="NONRETURNABLE">Non-Returnable</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {filteredLoans.length} of {loans.length} loans
                        </div>
                    </div>
                </div>
                
                {filteredLoans.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <p className="text-gray-500">
                            {filterStatus 
                                ? `You have no loans with the status "${filterStatus}".` 
                                : "You haven't borrowed any books yet."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredLoans.map(loan => (
                            <div key={loan.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-800">{loan.bookCopyOriginalBookTitle}</h3>
                                        <p className="text-sm text-gray-600">Book Copy ID: {loan.bookCopyId}</p>
                                        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2">
                                            <p className="text-sm">
                                                <span className="font-medium">Loan Date:</span> {new Date(loan.loanDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Due Date:</span> {new Date(loan.dueDate).toLocaleDateString()}
                                            </p>
                                            {loan.actualReturnDate && (
                                                <p className="text-sm">
                                                    <span className="font-medium">Returned:</span> {new Date(loan.actualReturnDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center space-x-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(loan.status)}`}>
                                                {loan.status}
                                            </span>
                                            {loan.status === 'BORROWED' && (
                                                <span className="text-sm">
                                                    {getDaysRemaining(loan.dueDate)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {loan.status === 'BORROWED' && (
                                        <div className="mt-4 md:mt-0">
                                            <button 
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                onClick={() => handleRequestReturn(loan)}
                                            >
                                                Request Return
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
