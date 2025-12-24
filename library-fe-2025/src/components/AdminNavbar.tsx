import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

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
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 10);
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const getNavLinkClass = (tab: string) =>
        `px-4 py-2 rounded-lg transition duration-200 font-medium ${selected === tab
            ? "bg-purple-600 text-white shadow-md"
            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
        }`;

    return (
        <>
            <div className="h-16" /> {/* Spacer */}

            <nav
                className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-md transition-transform duration-300 z-50 ${showNavbar ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                            Admin Portal
                        </h1>
                    </div>

                    <div className="flex space-x-3 items-center">
                        <Link to="/admin/dashboard" className={getNavLinkClass("dashboard")}>
                            Dashboard
                        </Link>

                        {/* Dropdown Manage (Sách, Tác giả...) */}
                        <div className="relative group">
                            <div className={`${getNavLinkClass("manage")} flex items-center gap-1 cursor-pointer`}>
                                Manage ▾
                            </div>
                            <div className="absolute top-full left-0 hidden group-hover:block pt-2 w-40 z-50">
                                <div className="flex flex-col bg-white shadow-xl border border-gray-100 rounded-lg overflow-hidden">
                                    <Link to="/admin/manage/books" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 border-b border-gray-50 text-sm">
                                        Books
                                    </Link>
                                    <Link to="/admin/manage/categories" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 border-b border-gray-50 text-sm">
                                        Categories
                                    </Link>
                                    <Link to="/admin/manage/authors" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 border-b border-gray-50 text-sm">
                                        Authors
                                    </Link>
                                    <Link to="/admin/manage/publishers" className="px-4 py-3 hover:bg-purple-50 text-left text-gray-700 text-sm">
                                        Publishers
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Các mục menu khác */}
                        {navItems.map((item) => (
                            <Link key={item.key} to={item.path} className={getNavLinkClass(item.key)}>
                                {item.name}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-gray-300 mx-2"></div>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg transition duration-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}