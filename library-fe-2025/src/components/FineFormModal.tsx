import { useState } from "react";

interface FineFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { username: string, amount: number, description: string, bookLoanId?: string }) => void;
}

export default function FineFormModal({ isOpen, onClose, onSubmit }: FineFormModalProps) {
    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [bookLoanId, setBookLoanId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            username,
            amount,
            description,
            bookLoanId: bookLoanId.trim() === "" ? undefined : bookLoanId
        });

        // Reset form
        setUsername("");
        setAmount(0);
        setDescription("");
        setBookLoanId("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-purple-800">Create New Fine</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            required
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="e.g. johndoe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (VND)</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="1000"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Reason for fine (e.g. Lost book, Damaged page...)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    {/* Book Loan ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Related Loan ID <span className="text-gray-400 font-normal">(Optional - Must be a number)</span>
                        </label>
                        <input
                            type="number" // Bắt buộc nhập số
                            min="1"
                            value={bookLoanId}
                            onChange={e => setBookLoanId(e.target.value)}
                            placeholder="e.g. 123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md">
                            Create Fine
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}