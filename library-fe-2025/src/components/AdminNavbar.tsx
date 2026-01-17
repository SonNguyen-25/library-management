import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavItem {
    name: string;
    path: string;
    key: string;
}

const navItems: NavItem[] = [
    { name: "Users", path: "/admin/users", key: "users" },
    { name: "Loans", path: "/admin/loans", key: "loans" },
    { name: "Requests", path: "/admin/requests", key: "requests" },
    { name: "Fines", path: "/admin/fines", key: "fines" },
];

export default function AdminNavbar({ selected = "dashboard" }: { selected?: string }) {
    // Lấy user từ context để hiển thị
    const { user, logout } = useAuth();

    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    // Logic ẩn hiện navbar khi scroll
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 10);
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Hàm style cho các link menu chính
    const getNavLinkClass = (tab: string) =>
        `px-4 py-2 rounded-lg transition duration-200 font-medium ${selected === tab
            ? "bg-purple-600 text-white shadow-md"
            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
        }`;

    return (
        <>
            <div className="h-16" /> {/* Spacer để nội dung không bị che bởi navbar fixed */}

            <nav
                className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-md transition-transform duration-300 z-50 ${showNavbar ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* 1. Logo / Brand */}
                    <div className="flex items-center gap-2">
                        <Link to="/admin/dashboard" className="flex items-center gap-2 no-underline group">
                            <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                                Admin Portal
                            </h1>
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <div className="flex space-x-3 items-center">
                        <Link to="/admin/dashboard" className={getNavLinkClass("dashboard")}>
                            Dashboard
                        </Link>

                        {/* Dropdown Manage */}
                        <div className="relative group">
                            <div className={`${getNavLinkClass("manage")} flex items-center gap-1 cursor-pointer`}>
                                Manage ▾
                            </div>
                            <div className="absolute top-full left-0 hidden group-hover:block pt-2 w-40 z-50">
                                <div className="flex flex-col bg-white shadow-xl border border-gray-100 rounded-lg overflow-hidden">
                                    <Link to="/admin/manage/books" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 border-b border-gray-50 text-sm hover:text-purple-700">
                                        Books
                                    </Link>
                                    <Link to="/admin/manage/categories" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 border-b border-gray-50 text-sm hover:text-purple-700">
                                        Categories
                                    </Link>
                                    <Link to="/admin/manage/authors" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 border-b border-gray-50 text-sm hover:text-purple-700">
                                        Authors
                                    </Link>
                                    <Link to="/admin/manage/publishers" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 text-sm hover:text-purple-700">
                                        Publishers
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Các mục menu từ mảng navItems */}
                        {navItems.map((item) => (
                            <Link key={item.key} to={item.path} className={getNavLinkClass(item.key)}>
                                {item.name}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-gray-300 mx-2"></div>

                        {/* 3. User Info & Profile Link */}
                        <div className="flex items-center gap-3 mr-2">
                            <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                                {user?.name || "Administrator"}
                            </span>

                            {/* Avatar */}
                            <Link
                                to="/admin/profile"
                                className={`w-9 h-9 rounded-full border-2 overflow-hidden transition-all ${
                                    selected === 'profile'
                                        ? 'border-purple-600 ring-2 ring-purple-200 shadow-md' // Highlight khi đang ở trang Profile
                                        : 'border-gray-200 hover:border-purple-400'
                                }`}
                                title="Admin Profile"
                            >
                                <img
                                    src={user?.avatarUrl || "https://ui-avatars.com/api/?name=Admin&background=random"}
                                    alt="Admin Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg transition duration-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}