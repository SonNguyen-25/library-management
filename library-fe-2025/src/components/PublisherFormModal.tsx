import { useState, useEffect } from "react";
import type {Publisher} from "../types/publisher";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    initialData?: Publisher | null;
}

export default function PublisherFormModal({ isOpen, onClose, onSubmit, initialData }: Props) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (initialData) setName(initialData.name);
        else setName("");
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-purple-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-purple-800">{initialData ? "Edit Publisher" : "New Publisher"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Publisher Name</label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)}
                               placeholder="e.g. Science Fiction"
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md transition-colors">
                            {initialData ? "Save Changes" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}