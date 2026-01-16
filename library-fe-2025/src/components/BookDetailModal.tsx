import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Book } from "../types/book";
import type { Review } from "../types/review";
import { reviewService } from "../services/reviewService";
import { requestService } from "../services/bookRequestService";
import { subscriptionService } from "../services/subscriptionService";
import { bookService } from "../services/bookService";

interface BookDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    book: Book | null;
    onUpdate?: () => void;
}

export default function BookDetailModal({ isOpen, onClose, book, onUpdate }: BookDetailModalProps) {
    const { user, isAuthenticated } = useAuth();
    // State dữ liệu
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    // State Form Tạo mới
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    // State Form Edit
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");

    // Lấy dữ liệu
    const loadData = useCallback(async (bookId: number) => {
        try {
            // Load reviews
            const reviewsData = await reviewService.getReviewsByBookId(bookId);
            setReviews(reviewsData);
            // Load book info mới nhất để lấy rating
            const bookData = await bookService.getBookById(bookId);
            setCurrentBook(bookData);
        } catch (e) {
            console.error("Lỗi load data modal:", e);
        }
    }, []);

    // useEffect chỉ chạy khi mở modal hoặc đổi sách (Dựa vào book.id)
    useEffect(() => {
        if (isOpen && book) {
            // Chỉ reset khi mở sách MỚI
            setCurrentBook(book);
            setNewRating(0);
            setNewComment("");
            setEditingReviewId(null); // Reset edit mode
            // Gọi hàm load
            loadData(book.id);
        }
    }, [isOpen, book?.id]); // Chỉ phụ thuộc book.id, không phụ thuộc object book

    // Tạo Review mới
    const handlePostReview = async () => {
        if (!isAuthenticated || !currentBook) return;
        if (newRating === 0) return alert("Please select a rating!");

        try {
            await reviewService.addOrUpdateReview(currentBook.id, newRating, newComment);
            await loadData(currentBook.id);
            // Reset form nhập
            setNewRating(0);
            setNewComment("");

            // Báo ra ngoài để cập nhật danh sách sách
            if (onUpdate) onUpdate();

            alert("Review posted!");
        } catch (error: any) {
            alert("Error: " + (error.response?.data?.message || "Failed to post review"));
        }
    };
    // Chuẩn bị Edit
    const startEdit = (review: Review) => {
        setEditingReviewId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };
    // Lưu Edit
    const handleUpdateReview = async () => {
        if (!currentBook) return;
        try {
            await reviewService.addOrUpdateReview(currentBook.id, editRating, editComment);

            await loadData(currentBook.id); // Reload lại trong modal
            setEditingReviewId(null); // Thoát chế độ edit

            if (onUpdate) onUpdate();

            alert("Review updated!");
        } catch (error: any) {
            alert("Error: " + (error.response?.data?.message || "Failed to update"));
        }
    };

    // Xóa Review
    const handleDeleteReview = async (reviewId: number) => {
        if (!currentBook) return;
        if (!confirm("Are you sure you want to delete your review?")) return;

        try {
            await reviewService.deleteReview(reviewId);
            await loadData(currentBook.id);
            if (onUpdate) onUpdate();
        } catch (error: any) {
            alert("Error: " + (error.response?.data?.message || "Failed to delete"));
        }
    };

    const handleBorrowClick = async () => {
        if (!isAuthenticated) return alert("Please login to borrow!");
        if (!currentBook) return;
        if (confirm(`Send borrow request for "${currentBook.title}"?`)) {
            try {
                await requestService.createBorrowRequest(currentBook.id);
                alert("Request sent! Please wait for approval.");
                onClose();
            } catch (error: any) {
                alert("Error: " + (error.response?.data?.message || "Failed to request"));
            }
        }
    };

    const handleSubscribe = async () => {
        if (!isAuthenticated) return alert("Please login to subscribe!");
        if (!currentBook) return;
        try {
            await subscriptionService.subscribe(currentBook.id);
            alert(`Subscribed to "${currentBook.title}"!`);
        } catch (error: any) {
            alert("Warning: " + (error.response?.data || "Failed"));
        }
    };

    if (!isOpen || !currentBook) return null;

    // Check xem user đã review chưa
    const userHasReview = user && reviews.some(r => r.user.username === user.username);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">

                {/* CỘT TRÁI */}
                <div className="w-full md:w-1/3 bg-gray-50 p-6 flex flex-col items-center border-r border-gray-100">
                    <div className="w-48 aspect-[2/3] shadow-lg rounded-lg overflow-hidden mb-6">
                        <img src={currentBook.coverUrl} alt={currentBook.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full space-y-3">
                        <button onClick={handleBorrowClick} disabled={!currentBook.available}
                                className={`w-full py-3 rounded-xl font-bold text-white transition-all ${currentBook.available ? "bg-blue-600 hover:bg-blue-700 shadow-lg" : "bg-gray-400 cursor-not-allowed"}`}>
                            {currentBook.available ? "Borrow This Book" : "Currently Unavailable"}
                        </button>
                        {!currentBook.available && (
                            <button onClick={handleSubscribe} className="w-full py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200">
                                🔔 Subscribe Notification
                            </button>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentBook.title}</h2>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-yellow-400 text-lg">★</span>
                                <span className="text-gray-700 font-bold">{currentBook.rating.toFixed(1)}</span>
                                <span className="text-gray-400 text-sm">({reviews.length} reviews)</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{currentBook.publisherName}</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{currentBook.categories.join(", ")}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Author(s):</span> {currentBook.authors.join(", ")}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-8"><p>{currentBook.description}</p></div>
                    <hr className="my-6 border-gray-100" />

                    {/* --- REVIEW SECTION --- */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>

                        {/* FORM TẠO MỚI (Chỉ hiện khi user chưa review và không đang edit) */}
                        {isAuthenticated && !userHasReview && !editingReviewId && (
                            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Write a review</h4>
                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setNewRating(star)} className={`text-2xl ${star <= newRating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
                                    ))}
                                </div>
                                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your thoughts..." className="w-full p-3 rounded-lg border border-gray-200 text-sm mb-2 focus:ring-2 focus:ring-blue-100 outline-none" rows={3}/>
                                <button onClick={handlePostReview} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">Post Review</button>
                            </div>
                        )}

                        {/* LIST REVIEWS */}
                        <div className="space-y-4">
                            {reviews.map((review) => {
                                const isMyReview = user && review.user.username === user.username;
                                const isEditing = editingReviewId === review.id;

                                return (
                                    <div key={review.id} className={`p-4 rounded-xl ${isMyReview ? "bg-blue-50 border border-blue-100" : "border-b border-gray-100"}`}>

                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {review.user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{review.user.username}</p>
                                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {/* Nút Edit/Delete chỉ hiện khi không đang edit */}
                                            {isMyReview && !isEditing && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => startEdit(review)} className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                                                    <button onClick={() => handleDeleteReview(review.id)} className="text-xs font-bold text-red-600 hover:underline">Delete</button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Nội dung hoặc Form Edit */}
                                        {isEditing ? (
                                            <div className="mt-2 bg-white p-3 rounded-lg border border-blue-200">
                                                <div className="flex gap-1 mb-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button key={star} onClick={() => setEditRating(star)} className={`text-lg ${star <= editRating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
                                                    ))}
                                                </div>
                                                <textarea value={editComment} onChange={e => setEditComment(e.target.value)} className="w-full p-2 border rounded-lg text-sm mb-2 outline-none" rows={2}/>
                                                <div className="flex gap-2">
                                                    <button onClick={handleUpdateReview} className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 font-bold">Save</button>
                                                    <button onClick={() => setEditingReviewId(null)} className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 font-bold">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex text-yellow-400 text-sm mb-1">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                                                <p className="text-gray-700 text-sm">{review.comment}</p>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}