import { useState, useEffect } from 'react';
import UserNavbar from '../../components/UserNavbar';
import { FineService } from '../../services/fineService';
import type {Fine} from '../../types/fine';
// Type mới

export default function UserFines() {
    const [finesList, setFinesList] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const data = await FineService.getMyFines();
                setFinesList(data);
            } catch (err) {
                console.error("Lỗi load fines", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFines();
    }, []);

    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const totalAmount = finesList.reduce((sum, fine) => sum + fine.amount, 0);

    const sortedFines = [...finesList].sort((a, b) => {
        if (sortBy === 'date') {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
            return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        }
    });

    const toggleSort = (field: 'date' | 'amount') => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc');
        }
    };

    return (
        <>
            <title>My Fines</title>
            <UserNavbar selected="fine" />

            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Fines</h2>
                <p className="text-gray-700 mb-6">
                    View and manage your library fines.
                </p>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-700">Summary</h3>
                            <p className="text-gray-600 mt-2">
                                You have {finesList.length} {finesList.length === 1 ? 'fine' : 'fines'} totaling:
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 text-3xl font-bold text-red-600">
                            {totalAmount.toLocaleString()} VND
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : finesList.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <p className="text-gray-500">
                            You don't have any fines. Keep returning your books on time!
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Book / Ref
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => toggleSort('amount')}
                                >
                                    Amount {sortBy === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => toggleSort('date')}
                                >
                                    Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {sortedFines.map(fine => (
                                <tr key={fine.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {fine.bookLoan?.bookCopy.book.title || `Loan #${fine.bookLoan?.id || 'Manual'}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                        {fine.amount.toLocaleString()} VND
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {fine.description || 'No description'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(fine.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {finesList.length > 0 && (
                    <div className="mt-6 bg-blue-100 rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-blue-700 mb-2">Payment Information</h3>
                        <p className="text-gray-700">
                            Please visit the library to pay your fines. We accept cash and card payments.
                        </p>
                        <p className="text-gray-700 mt-2">
                            Note: Unpaid fines may affect your ability to borrow books in the future.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}