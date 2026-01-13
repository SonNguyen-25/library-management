import type {Book} from "../types/book";

interface BookCardProps {
    book: Book;
    onClick: (book: Book) => void;
    onBorrow: (book: Book) => void;
}

export default function BookCard({ book, onClick, onBorrow }: BookCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            {/* Ảnh bìa */}
            <div
                className="h-64 overflow-hidden relative group cursor-pointer"
                onClick={() => onClick(book)}
            >
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badge trạng thái */}
                <div className="absolute top-2 right-2">
                    {book.available ? (
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                            Available
                        </span>
                    ) : (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                            Out of Stock
                        </span>
                    )}
                </div>
            </div>

            {/* Thông tin sách */}
            <div className="p-4 flex flex-col flex-grow">
                <h3
                    className="font-bold text-gray-800 mb-1 line-clamp-1 hover:text-blue-600 cursor-pointer"
                    onClick={() => onClick(book)}
                    title={book.title}
                >
                    {book.title}
                </h3>

                {/* Hiển thị tác giả (nối mảng thành chuỗi) */}
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {book.authors.join(", ")}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-sm font-medium text-gray-700">{book.rating.toFixed(1)}</span>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={() => onBorrow(book)}
                        disabled={!book.available}
                        className={`w-full py-2 rounded font-semibold transition-colors ${
                            book.available
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {book.available ? "Borrow" : "Unavailable"}
                    </button>
                </div>
            </div>
        </div>
    );
}