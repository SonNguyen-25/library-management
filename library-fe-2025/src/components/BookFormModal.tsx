import { useState, useEffect } from "react";
import type {Book} from "../data/books";
import authorsData from "../data/authors";
import categoriesData from "../data/categories";
import publishersData from "../data/publishers";

interface BookFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Book, 'id'>) => void;
    initialData?: Book | null;
}

export default function BookFormModal({ isOpen, onClose, onSubmit, initialData }: BookFormModalProps) {
    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [authorIds, setAuthorIds] = useState<string[]>([]);
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [publisherId, setPublisherId] = useState("");

    // Load data khi mở modal (nếu là sửa)
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setCoverUrl(initialData.coverUrl);
            setAuthorIds(initialData.authorIds.map(String));
            setCategoryIds(initialData.categoryIds.map(String));
            setPublisherId(initialData.publisherId?.toString() || "");
        } else {
            // Reset khi thêm mới
            setTitle("");
            setDescription("");
            setCoverUrl("https://placehold.co/400x600?text=No+Cover");
            setAuthorIds([]);
            setCategoryIds([]);
            setPublisherId("");
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const bookData: Omit<Book, 'id'> = {
            title,
            description,
            coverUrl,
            authorIds: authorIds.map(Number),
            categoryIds: categoryIds.map(Number),
            publisherId: publisherId ? parseInt(publisherId) : null,
            rating: initialData?.rating || 0
        };

        onSubmit(bookData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-purple-800">
                        {initialData ? "Edit Book" : "Add New Book"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input required type="text" value={title} onChange={e => setTitle(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Book Title"/>
                    </div>

                    {/* Cover URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                        <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://..."/>
                    </div>

                    {/* Authors & Categories (Multi-select simulation) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author (Select multiple)</label>
                            <select multiple value={authorIds} onChange={e => setAuthorIds(Array.from(e.target.selectedOptions, option => option.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-32">
                                {authorsData.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category (Select multiple)</label>
                            <select multiple value={categoryIds} onChange={e => setCategoryIds(Array.from(e.target.selectedOptions, option => option.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-32">
                                {categoriesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Publisher */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                        <select value={publisherId} onChange={e => setPublisherId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                            <option value="">Select Publisher</option>
                            {publishersData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Book synopsis..."/>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md">
                            {initialData ? "Save Changes" : "Create Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}