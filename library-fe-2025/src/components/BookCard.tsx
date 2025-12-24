import type {Book} from "../data/books";
import { reviewService } from "../services/reviewService";

interface BookCardProps {
    book: Book;
    onBorrow: (book: Book) => void;
    onClick: (book: Book) => void;
}

export default function BookCard({ book, onBorrow, onClick }: BookCardProps) {
    const rating = reviewService.getAverageRating(book.id);
    const reviewCount = reviewService.getReviewCount(book.id);

    return (
        <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
            <div
                className="relative aspect-[2/3] overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => onClick(book)}
            >
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                {rating > 0 && (
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-yellow-600 shadow-sm flex items-center gap-1">
                        <span>⭐</span> {rating} <span className="text-gray-400 font-normal">({reviewCount})</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3
                    className="font-bold text-gray-800 text-lg line-clamp-1 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                    title={book.title}
                    onClick={() => onClick(book)}
                >
                    {book.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {book.description}
                </p>

                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Ngăn mở modal khi bấm nút Borrow
                        onBorrow(book);
                    }}
                    className="w-full py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Borrow Now
                </button>
            </div>
        </div>
    );
}