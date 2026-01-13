import type {Book} from "../types/book";

interface AdminBookProps {
    book: Book;
    onEdit: (book: Book) => void;
    onDelete: (id: number) => void;
}

export default function AdminBook({ book, onEdit, onDelete }: AdminBookProps) {
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
                        <p className="truncate"><span className="font-semibold text-purple-700">Author:</span> {book.authors.join(", ")}</p>
                        <p className="truncate"><span className="font-semibold text-purple-700">Category:</span> {book.categories.join(", ")}</p>
                        <p className="truncate"><span className="font-semibold text-purple-700">Publisher:</span> {book.publisherName}</p>

                        {/* Hiển thị trạng thái */}
                        <p className="">
                            <span className="font-semibold text-purple-700">Status: </span>
                            <span className={book.available ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {book.available ? "Available" : "Out of Stock"}
                            </span>
                        </p>
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