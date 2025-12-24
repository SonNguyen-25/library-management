import type {Book} from "../data/books";
import authorsData from "../data/authors";
import categoriesData from "../data/categories";
import publishersData from "../data/publishers";

interface AdminBookProps {
    book: Book;
    onEdit: (book: Book) => void;
    onDelete: (id: number) => void;
}

export default function AdminBook({ book, onEdit, onDelete }: AdminBookProps) {
    const getAuthorNames = () => book.authorIds.map(id => authorsData.find(a => a.id === id)?.name).join(", ");
    const getCategoryNames = () => book.categoryIds.map(id => categoriesData.find(c => c.id === id)?.name).join(", ");
    const getPublisherName = () => publishersData.find(p => p.id === book.publisherId)?.name || "Unknown";

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex gap-4 mb-4">
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-md shadow-sm bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-1 text-lg" title={book.title}>
                        {book.title}
                    </h3>
                    <div className="text-xs text-gray-500 space-y-1">
                        <p className="truncate"><span className="font-semibold text-purple-700">Author:</span> {getAuthorNames()}</p>
                        <p className="truncate"><span className="font-semibold text-purple-700">Category:</span> {getCategoryNames()}</p>
                        <p className="truncate"><span className="font-semibold text-purple-700">Publisher:</span> {getPublisherName()}</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto flex gap-2 pt-3 border-t border-gray-100">
                <button
                    onClick={() => onEdit(book)}
                    className="flex-1 bg-yellow-50 text-yellow-700 py-2 rounded-md text-sm font-medium hover:bg-yellow-100 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(book.id)}
                    className="flex-1 bg-red-50 text-red-700 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}