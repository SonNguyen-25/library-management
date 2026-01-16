import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import LoanChart from "../../components/LoanChart";
import { DashboardService, type MetricsData } from "../../services/dashboardService";

export default function AdminDashboard() {
    const [data, setData] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const res = await DashboardService.getMetrics();
                setData(res);
            } catch (err) {
                console.error('Error fetching dashboard metrics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-purple-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <>
            <title>Admin Dashboard</title>
            <AdminNavbar selected="dashboard" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome back, Admin! 👋</h2>
                        <p className="text-gray-600 mt-2">Here's the real-time overview of your library.</p>
                    </div>

                    {/* Library Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Books" value={data?.totalBooks || 0} icon="📚" link="/admin/manage/books" color="bg-blue-500" />
                        <StatCard title="Categories" value={data?.totalCategories || 0} icon="🏷️" link="/admin/manage/categories" color="bg-indigo-500" />
                        <StatCard title="Authors" value={data?.totalAuthors || 0} icon="✍️" link="/admin/manage/authors" color="bg-pink-500" />
                        <StatCard title="Publishers" value={data?.totalPublishers || 0} icon="🏢" link="/admin/manage/publishers" color="bg-orange-500" />
                    </div>

                    {/* Management Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Active Users" value={data?.activeUsers || 0} icon="👥" link="/admin/users" color="bg-emerald-500" />
                        <StatCard title="Active Loans" value={data?.activeLoans || 0} icon="📖" link="/admin/loans" color="bg-amber-500" />
                        <StatCard title="Pending Requests" value={data?.pendingRequests || 0} icon="⏳" link="/admin/requests" color="bg-red-500" />
                    </div>

                    {/* Charts & Trending */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* CHART */}
                        <div className="lg:col-span-2">
                            <LoanChart data={data?.loanChart || []} />
                        </div>

                        {/* TRENDING */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-purple-700 mb-4">🔥 Top Borrowed Books</h3>
                            {data?.trendingBooks && data.trendingBooks.length > 0 ? (
                                <div className="space-y-4">
                                    {data.trendingBooks.map((book, index) => (
                                        <div key={book.id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 hover:bg-purple-50 p-2 rounded transition">
                                            <div className="flex items-center gap-3">
                                                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold 
                                                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                                        index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-700'}`}>
                                                    {index + 1}
                                                </span>
                                                <span className="text-gray-700 text-sm font-medium line-clamp-1" title={book.title}>
                                                    {book.title}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                                {book.borrowCount} loans
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-4">No borrowing data yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatCard({ title, value, icon, link, color }: { title: string, value: number, icon: string, link: string, color: string }) {
    return (
        <Link to={link} className="block group">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</h3>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-lg ${color} text-white group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
        </Link>
    );
}