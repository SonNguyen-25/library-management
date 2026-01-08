import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type {Role} from "../../types/auth";

export default function LoginPage() {
    // State UI: Chỉ để điều khiển hiển thị Tab (User vs Admin)
    const [activeTab, setActiveTab] = useState<"user" | "admin">("user");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Lấy hàm login logout và trạng thái loading từ AuthContext
    const { login, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const isAdminTab = activeTab === "admin";

    const ADMIN_ROLES: Role[] = ['SUPER_ADMIN', 'LIBRARY_MANAGER', 'USER_MANAGER', 'CIRCULATION_MANAGER'];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Gọi hàm login từ Context
            await login({ username, password });

            // Lấy thông tin user vừa lưu để kiểm tra quyền
            // Lấy trực tiếp từ localStorage vì state context có thể chưa update kịp trong hàm này
            const userStr = localStorage.getItem('user');
            if (!userStr) return;

            const currentUser = JSON.parse(userStr);
            const userRole = currentUser.role as Role;
            const isUserAdminRole = ADMIN_ROLES.includes(userRole);

            // Trường hợp đang ở Tab Admin mà tài khoản là USER thường
            if (isAdminTab && !isUserAdminRole) {
                setError("Tài khoản này không có quyền truy cập trang Quản trị!");
                logout();
                return;
            }

            if (!isAdminTab && isUserAdminRole) {
                setError("Tài khoản Quản trị viên vui lòng đăng nhập bên tab ADMIN!");
                logout();
                return;
            }
            if (isAdminTab) {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/user/home", { replace: true });
            }

        } catch (err: any) {
            console.error("Login Error:", err);
            if (typeof err === 'string') {
                setError(err);
            } else if (err?.response?.status === 403 || err?.response?.status === 401) {
                setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
            } else {
                setError("Lỗi kết nối Server. Vui lòng thử lại sau.");
            }
        }
    };

    return (
        // Wrapper chính với nền gradient đổi màu theo role
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
            isAdminTab
                ? "bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400"
                : "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300"
        } p-4`}>

            <div className="bg-white pt-20 pb-8 px-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden transition-all duration-300">

                {/* Tab chuyển đổi User/Admin ở trên cùng */}
                <div className="absolute top-0 left-0 right-0 flex rounded-t-2xl overflow-hidden h-14">
                    <button
                        type="button"
                        onClick={() => setActiveTab("user")}
                        className={`w-1/2 py-3 text-sm font-bold tracking-wide transition duration-300 ${
                            !isAdminTab
                                ? "bg-blue-600 text-white shadow-inner"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        USER
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("admin")}
                        className={`w-1/2 py-3 text-sm font-bold tracking-wide transition duration-300 ${
                            isAdminTab
                                ? "bg-purple-600 text-white shadow-inner"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        ADMIN
                    </button>
                </div>

                {/* Tiêu đề thay đổi theo role */}
                <h2 className={`text-3xl font-bold text-center mb-6 transition-colors duration-300 ${
                    isAdminTab ? "text-purple-700" : "text-blue-700"
                }`}>
                    {isAdminTab ? "Admin Portal" : "Library Login"}
                </h2>

                {/* Thông báo lỗi */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center animate-pulse font-medium">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form className="flex flex-col space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold text-sm" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder={isAdminTab ? "admin" : "Enter username"}
                            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                isAdminTab ? "focus:ring-purple-400 focus:border-purple-400" : "focus:ring-blue-400 focus:border-blue-400"
                            }`}
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold text-sm" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                isAdminTab ? "focus:ring-purple-400 focus:border-purple-400" : "focus:ring-blue-400 focus:border-blue-400"
                            }`}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                            isAdminTab
                                ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
                                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Link đăng ký chỉ hiện cho User */}
                {!isAdminTab && (
                    <p className="mt-8 text-center text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                            Create Account
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}