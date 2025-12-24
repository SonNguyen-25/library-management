import { Link } from 'react-router-dom';
import UserNavbar from '../../components/UserNavbar';
import subscriptions from '../../data/subscriptions';

export default function UserSubscriptions() {
    const subscriptionsList = subscriptions.slice(0, 2); // Show sample data

    const handleUnsubscribe = () => {
        alert(`Tính năng hủy đăng ký đang được phát triển. Vui lòng quay lại sau!`);
    };

    return (
        <>
            <title>My Subscriptions</title>
            <UserNavbar selected="subscriptions" />
            
            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Subscriptions</h2>
                <p className="text-gray-700 mb-6">
                    Books you are subscribed to be notified when they become available.
                </p>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    {subscriptionsList.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">You don't have any active subscriptions.</p>
                            <Link to="/user/search" className="mt-4 inline-block text-blue-600 hover:underline">
                                Browse books to subscribe
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {subscriptionsList.map(subscription => (
                                <div key={subscription.id} className="border-b pb-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-blue-800">{subscription.title}</h3>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        onClick={handleUnsubscribe}>
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
