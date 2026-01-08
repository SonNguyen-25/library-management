import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type {Book} from "../data/books";
import type {Review} from "../data/reviews";
import { reviewService } from "../services/reviewService";
import bookCopies from "../data/bookCopies";

interface BookDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onBorrow: (book: Book) => void;
}

export default function BookDetailModal({ isOpen, onClose, book, onBorrow }: BookDetailModalProps) {
    const { user, isAuthenticated } = useAuth();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState("");
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        if (book) {
            // 1. Load reviews
            setReviews(reviewService.getReviewsByBookId(book.id));

            const availableCopies = bookCopies.filter(
                c => c.bookId === book.id && c.status === "AVAILABLE"
            );
            setIsAvailable(availableCopies.length > 0);

            // Reset form
            setUserRating(0);
            setUserComment("");
        }
    }, [book, isOpen]);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            alert("Vui lòng đăng nhập để viết đánh giá!");
            return;
        }

        if (!book) return;
        if (userRating === 0) {
            alert("Please select a rating star!");
            return;
        }

        const newReview = reviewService.addReview(
            book.id,
            user.username,
            user.name || "Guest User",
            userRating,
            userComment
        );

        // Cập nhật lại danh sách hiển thị ngay lập tức
        setReviews([newReview, ...reviews]);
        setUserRating(0);
        setUserComment("");
    };

    const handleBorrowClick = () => {
        if (!isAuthenticated) {
            alert("Bạn cần đăng nhập để mượn sách!");
            return;
        }
        if (book) {
            onBorrow(book);
        }
    }
    const handleSubscribe = () => {
        if (!isAuthenticated) {
            alert("Bạn cần đăng nhập để đăng ký nhận thông báo!");
            return;
        }
        alert(`Đã đăng ký nhận thông báo cho sách "${book?.title}".`);
    };

    if (!isOpen || !book) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">

                {/* CỘT TRÁI: Ảnh & Hành động chính */}
                <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col items-center border-r border-gray-100">
                    <div className="w-48 aspect-[2/3] shadow-lg rounded-lg overflow-hidden mb-6">
                        <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="w-full space-y-3">
                        {/* Nút Mượn */}
                        <button
                            onClick={handleBorrowClick}
                            disabled={!isAvailable}
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
                                ${isAvailable
                                ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                : "bg-gray-400 cursor-not-allowed"}`}
                        >
                            {isAvailable ? "Borrow This Book" : "Currently Unavailable"}
                        </button>

                        {/* Nút Đăng ký (Hiện khi hết sách) */}
                        {!isAvailable && (
                            <button
                                onClick={handleSubscribe}
                                className="w-full py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all"
                            >
                                🔔 Subscribe for Notification
                            </button>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: Thông tin & Review */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    Book ID: {book.id}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {isAvailable ? "Available" : "Out of Stock"}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p>{book.description}</p>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    {/* PHẦN ĐÁNH GIÁ (REVIEWS) */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Reviews <span className="text-gray-400 text-sm font-normal">({reviews.length})</span>
                        </h3>

                        {/* Form viết review */}
                        {isAuthenticated ? (
                            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Write a review as {user?.name}</h4>
                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setUserRating(star)}
                                            className={`text-2xl transition-colors ${star <= userRating ? "text-yellow-400" : "text-gray-300"}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={userComment}
                                    onChange={(e) => setUserComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm mb-2"
                                    rows={2}
                                />
                                <button
                                    onClick={handleSubmitReview}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
                                >
                                    Post Review
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-xl mb-6 text-center text-sm text-gray-500">
                                Please <span className="font-bold text-blue-600">Login</span> to write a review.
                            </div>
                        )}

                        {/* Danh sách review */}
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 italic text-center py-4">No reviews yet. Be the first!</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-gray-900">{review.userName}</span>
                                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex text-yellow-400 text-sm mb-1">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                        <p className="text-gray-600 text-sm">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}