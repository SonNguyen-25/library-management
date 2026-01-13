import { useState, useEffect } from "react";
import type {Book} from "../types/book";

interface BookFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: Book | null;
}

export default function BookFormModal({ isOpen, onClose, onSubmit, initialData }: BookFormModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [authorsStr, setAuthorsStr] = useState("");
    const [categoriesStr, setCategoriesStr] = useState("");
    const [publisherName, setPublisherName] = useState("");
    const [available, setAvailable] = useState(true);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setCoverUrl(initialData.coverUrl);
            setAuthorsStr(initialData.authors.join(", "));
            setCategoriesStr(initialData.categories.join(", "));
            setPublisherName(initialData.publisherName);
            setAvailable(initialData.available);
        } else {
            // Reset khi thêm mới
            setTitle("");
            setDescription("");
            setCoverUrl("https://placehold.co/400x600?text=No+Cover");
            setAuthorsStr("");
            setCategoriesStr("");
            setPublisherName("");
            setAvailable(true);
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const bookData = {
            title,
            description,
            coverUrl,
            // Tách chuỗi thành mảng
            authors: authorsStr.split(",").map(s => s.trim()).filter(s => s),
            categories: categoriesStr.split(",").map(s => s.trim()).filter(s => s),
            publisherName,
            available,
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

                    {/* Authors & Categories */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Authors (comma separated)</label>
                            <input type="text" value={authorsStr} onChange={e => setAuthorsStr(e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                   placeholder="J.K. Rowling, Nam Cao..."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categories (comma separated)</label>
                            <input type="text" value={categoriesStr} onChange={e => setCategoriesStr(e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                   placeholder="Fantasy, IT, Horror..."/>
                        </div>
                    </div>

                    {/* Publisher */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publisher Name</label>
                        <input type="text" value={publisherName} onChange={e => setPublisherName(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                               placeholder="NXB Kim Dong"/>
                    </div>

                    {/* Status Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="availableCheck"
                            checked={available}
                            onChange={e => setAvailable(e.target.checked)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="availableCheck" className="text-sm font-medium text-gray-700">Is Available?</label>
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