import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import VisitChart from "../../components/VisitChart";
import { DashboardService, type MetricsData } from "../../services/dashboardService";

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await DashboardService.getMetrics();
                setMetrics(data);
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
                        <p className="text-gray-600 mt-2">Here's what's happening with your library today.</p>
                    </div>

                    {/* Section 1: Library Stats (Books, Categories...) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Books"
                            value={metrics?.books || 0}
                            icon="📚"
                            link="/admin/manage/books"
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Categories"
                            value={metrics?.categories || 0}
                            icon="Vx"
                            link="/admin/manage/categories"
                            color="bg-indigo-500"
                        />
                        <StatCard
                            title="Authors"
                            value={metrics?.authors || 0}
                            icon="✍️"
                            link="/admin/manage/authors"
                            color="bg-pink-500"
                        />
                        <StatCard
                            title="Publishers"
                            value={metrics?.publishers || 0}
                            icon="🏢"
                            link="/admin/manage/publishers"
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Section 2: Management Stats (Users, Loans...) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Active Users"
                            value={metrics?.users || 0}
                            icon="👥"
                            link="/admin/users"
                            color="bg-emerald-500"
                        />
                        <StatCard
                            title="Active Loans"
                            value={metrics?.loans || 0}
                            icon="📖"
                            link="/admin/loans"
                            color="bg-amber-500"
                        />
                        <StatCard
                            title="Pending Requests"
                            value={metrics?.requests || 0}
                            icon="⏳"
                            link="/admin/requests"
                            color="bg-red-500"
                        />
                    </div>

                    {/* Section 3: Charts & Trending */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <VisitChart />
                        </div>

                        {/* Trending Box */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4">🔥 Trending Books</h3>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                                        <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                                    {i}
                                </span>
                                            <span className="text-gray-700 text-sm font-medium">Book Title Placeholder {i}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{(1000 - i * 150)} views</span>
                                    </div>
                                ))}
                            </div>
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