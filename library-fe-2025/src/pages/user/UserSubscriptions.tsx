import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import { subscriptionService } from '../../services/subscriptionService';
import type {Subscription} from '../../types/subscription';
import { notificationService } from '../../services/notificationService';
import type {Notification} from '../../types/notification';

export default function UserSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [subsData, notiData] = await Promise.all([
                subscriptionService.getMySubscriptions(),
                notificationService.getMyNotifications()
            ]);
            setSubscriptions(subsData);
            setNotifications(notiData);

            // Nếu có thông báo chưa đọc, tự động đánh dấu đã đọc sau khi load xong
            if (notiData.some(n => !n.isRead)) {
                await notificationService.markAllAsRead();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUnsubscribe = async (id: number, bookTitle: string) => {
        if (!confirm(`Hủy đăng ký nhận thông báo cho sách "${bookTitle}"?`)) return;
        try {
            await subscriptionService.unsubscribe(id);
            // Reload list sub, không cần reload noti
            const subsData = await subscriptionService.getMySubscriptions();
            setSubscriptions(subsData);
        } catch (error: any) {
            alert("Lỗi: " + (error.response?.data || "Không thể hủy đăng ký"));
        }
    };

    return (
        <>
            <title>My Subscriptions</title>
            <UserNavbar selected="subscriptions" />

            <div className="min-h-screen bg-blue-50 p-6">
                <div className="max-w-5xl mx-auto">

                    {/* DANH SÁCH THÔNG BÁO */}
                    {notifications.length > 0 && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                                    🔔 Recent Notifications
                                </h2>
                                <button
                                    className="text-xs text-gray-500 hover:text-red-500 underline"
                                    onClick={async () => {
                                        if(confirm("Are you sure you want to delete ALL notifications?")) {
                                            try {
                                                await notificationService.deleteAll();
                                                setNotifications([]);
                                            } catch (e) {
                                                console.error("Lỗi xóa tất cả thông báo", e);
                                                alert("Không thể xóa thông báo. Vui lòng thử lại.");
                                            }
                                        }
                                    }}
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden max-h-60 overflow-y-auto">
                                {notifications.map(noti => (
                                    <div key={noti.id} className={`p-4 border-b border-gray-100 last:border-0 transition flex justify-between items-start group ${noti.isRead ? 'bg-white' : 'bg-blue-50'}`}>
                                        <div>
                                            <p className={`text-sm ${noti.isRead ? 'text-gray-600' : 'text-blue-800 font-semibold'}`}>
                                                {noti.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(noti.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await notificationService.delete(noti.id);
                                                    setNotifications(prev => prev.filter(n => n.id !== noti.id));
                                                } catch (e) {
                                                    console.error("Lỗi xóa thông báo", e);
                                                }
                                            }}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            title="Delete notification"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-blue-800 mb-2">My Subscriptions</h2>
                    <p className="text-gray-600 mb-6">
                        You will be notified when these books become available.
                    </p>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading...</div>
                    ) : subscriptions.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-10 text-center border border-gray-100">
                            <div className="text-4xl mb-3">🔕</div>
                            <p className="text-gray-500 text-lg">You don't have any active subscriptions.</p>
                            <Link to="/user/search" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Browse Books
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {subscriptions.map(sub => (
                                <div key={sub.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4 transition hover:shadow-md border border-gray-100">
                                    <div className="w-16 h-24 flex-shrink-0">
                                        <img
                                            src={sub.book.coverUrl}
                                            alt={sub.book.title}
                                            className="w-full h-full object-cover rounded-md shadow-sm"
                                        />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="font-bold text-lg text-gray-800">{sub.book.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            Subscribed on: {new Date(sub.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-medium transition whitespace-nowrap"
                                        onClick={() => handleUnsubscribe(sub.id, sub.book.title)}
                                    >
                                        Unsubscribe
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}