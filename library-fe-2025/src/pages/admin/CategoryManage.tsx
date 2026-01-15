import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { CategoryService } from "../../services/categoryService";
import type {Category} from "../../types/category";
import CategoryFormModal from "../../components/CategoryFormModal";

export default function CategoryManage() {
    const [items, setItems] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Category | null>(null);

    const fetch = async () => {
        setLoading(true);
        const data = await CategoryService.getAll();
        // Sắp xếp ID giảm dần (mới nhất lên đầu)
        setItems(data.sort((a, b) => b.id - a.id));
        setLoading(false);
    };

    useEffect(() => { fetch(); }, []);

    const handleSubmit = async (name: string) => {
        if (editingItem) await CategoryService.update(editingItem.id, name);
        else await CategoryService.create(name);
        fetch();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Delete this category?")) {
            try {
                await CategoryService.delete(id);
                fetch();
            } catch (error: any) {
                const msg = error.response?.data?.message || "Không thể xóa thể loại này.";
                alert("Lỗi: " + msg);
            }
        }
    };

    // Logic tìm kiếm
    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <title>Manage Categories</title>
            <AdminNavbar selected="manage" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-800">Categories</h2>
                            <p className="text-gray-600 text-sm mt-1">Total: {items.length} records</p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-full md:w-64 shadow-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button
                                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md whitespace-nowrap transition-colors"
                            >
                                + Add Category
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-purple-100 text-purple-800 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={3} className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={3} className="text-center py-8 text-gray-500">No categories found.</td></tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-purple-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 font-mono text-sm">#{item.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800 text-lg">{item.name}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                                                className="px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-sm font-bold transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-bold transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingItem}
            />
        </>
    );
}