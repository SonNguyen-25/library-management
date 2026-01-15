import { useCallback, useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { notificationService } from "../services/notificationService";

export default function UserNavbar({ selected = "home" }: { selected?: string }) {
    const navigate = useNavigate();
    const location = useLocation(); //reload khi chuyển trang
    const { logout, user } = useAuth();
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            notificationService.getUnreadCount()
                .then(count => setUnreadCount(count))
                .catch(err => console.error(err));
        }
    }, [user, location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 10);
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll, lastScrollY]);

    const getNavLinkClass = (tab: string) =>
        `px-4 py-2 rounded-lg transition duration-200 font-medium relative ${ 
            selected === tab
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`;

    return (
        <>
            <div className="h-16" />

            <nav
                className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-md transition-transform duration-300 z-50 ${
                    showNavbar ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <h1 className="text-xl font-bold text-blue-700">Library Portal</h1>
                    </div>

                    <div className="flex space-x-2">
                        <Link to="/user/home" className={getNavLinkClass("home")}>Home</Link>
                        <Link to="/user/search" className={getNavLinkClass("search")}>Search</Link>
                        <Link to="/user/loaned" className={getNavLinkClass("loan")}>Loaned</Link>
                        <Link to="/user/requests" className={getNavLinkClass("request")}>Requests</Link>
                        <Link to="/user/subscriptions" className={getNavLinkClass("subscriptions")}>
                            Subscriptions
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/user/fines" className={getNavLinkClass("fine")}>Fines</Link>
                        <Link to="/user/profile" className={getNavLinkClass("profile")}>Profile</Link>

                        <div className="w-px h-8 bg-gray-200 mx-2"></div>

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