import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
    // State lưu role hiện tại, mặc định là "user"
    const [role, setRole] = useState<"user" | "admin">("user");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { checkAuthStatus } = useAuth();

    const isAdmin = role === "admin";

    // Lấy đường dẫn user muốn vào trước đó (nếu có)
    const from = location.state?.from || (isAdmin ? '/admin' : '/user');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const success = await authService.login(username, password);

            if (success) {
                await checkAuthStatus();

                // Kiểm tra lại role của user vừa đăng nhập có khớp với tab đang chọn không
                const currentUser = authService.getCurrentUser();
                if (isAdmin && currentUser.role !== 'ADMIN') {
                    setError("Tài khoản này không có quyền Admin!");
                    authService.logout();
                    setLoading(false);
                    return;
                }

                console.log('Login successful, redirecting to:', from);
                navigate(isAdmin ? "/admin/dashboard" : "/user/home", { replace: true });
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            setError("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Wrapper chính với nền gradient đổi màu theo role (Tím cho Admin, Xanh cho User)
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
            isAdmin
                ? "bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400"
                : "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300"
        } p-4`}>

            <div className="bg-white pt-20 pb-8 px-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden transition-all duration-300">

                {/* Tab chuyển đổi User/Admin ở trên cùng */}
                <div className="absolute top-0 left-0 right-0 flex rounded-t-2xl overflow-hidden h-14">
                    <button
                        onClick={() => setRole("user")}
                        className={`w-1/2 py-3 text-sm font-bold tracking-wide transition duration-300 ${
                            !isAdmin
                                ? "bg-blue-600 text-white shadow-inner"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        USER
                    </button>
                    <button
                        onClick={() => setRole("admin")}
                        className={`w-1/2 py-3 text-sm font-bold tracking-wide transition duration-300 ${
                            isAdmin
                                ? "bg-purple-600 text-white shadow-inner"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        ADMIN
                    </button>
                </div>

                {/* Tiêu đề thay đổi theo role */}
                <h2 className={`text-3xl font-bold text-center mb-6 transition-colors duration-300 ${
                    isAdmin ? "text-purple-700" : "text-blue-700"
                }`}>
                    {isAdmin ? "Admin Portal" : "Library Login"}
                </h2>

                {/* Thông báo lỗi */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
                        {error}
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
                            placeholder={isAdmin ? "admin" : "johndoe"}
                            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all duration-300 ${
                                isAdmin ? "focus:ring-purple-400 focus:border-purple-400" : "focus:ring-blue-400 focus:border-blue-400"
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
                                isAdmin ? "focus:ring-purple-400 focus:border-purple-400" : "focus:ring-blue-400 focus:border-blue-400"
                            }`}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                            isAdmin
                                ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
                                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Link đăng ký chỉ hiện cho User */}
                {!isAdmin && (
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