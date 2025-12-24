import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminBook from "../../components/AdminBook";
import BookFormModal from "../../components/BookFormModal";
import bookService from "../../services/bookService";
import type {Book} from "../../data/books";

export default function BookManage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    // Load data
    const fetchBooks = async () => {
        setLoading(true);
        const data = await bookService.getAll();
        setBooks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Filter theo search
    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toString().includes(searchTerm)
    );

    // Handlers
    const handleAddClick = () => {
        setEditingBook(null); // Mode thêm mới
        setIsModalOpen(true);
    };

    const handleEditClick = (book: Book) => {
        setEditingBook(book); // Mode sửa
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            await bookService.delete(id);
            fetchBooks(); // Reload list
        }
    };

    const handleFormSubmit = async (data: Omit<Book, 'id'>) => {
        if (editingBook) {
            await bookService.update(editingBook.id, data);
        } else {
            await bookService.create(data);
        }
        fetchBooks(); // Reload list
    };

    return (
        <>
            <title>Manage Books</title>
            <AdminNavbar selected="dashboard" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-800">Manage Books</h2>
                            <p className="text-gray-600 text-sm">Total: {books.length} books</p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Search by title or ID..."
                                className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 w-full md:w-64"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button
                                onClick={handleAddClick}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium whitespace-nowrap shadow-md flex items-center gap-2"
                            >
                                <span>+</span> Add New Book
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="text-center py-10 text-purple-600">Loading books data...</div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                            <p className="text-gray-500">No books found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map(book => (
                                <AdminBook
                                    key={book.id}
                                    book={book}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <BookFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingBook}
            />
        </>
    );
}