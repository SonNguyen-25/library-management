import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const { register, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        try {
            await register({
                username,
                password,
                name,
                email
            });
            // Nếu thành công, AuthContext tự set user và token
            // Chuyển hướng về trang chủ User
            navigate("/user/home");

        } catch (err: any) {
            console.error("Register Error:", err);
            const message = err.response?.data?.message || err.response?.data || "Đăng ký thất bại. Vui lòng thử lại!";
            setError(typeof message === 'string' ? message : JSON.stringify(message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
            <div className="bg-white py-8 px-8 rounded-2xl shadow-2xl w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Create Account
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold text-sm">Full Name</label>
                        <input
                            type="text"
                            placeholder="Nguyen Van A"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold text-sm">Username</label>
                        <input
                            type="text"
                            placeholder="username123"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold text-sm">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-semibold text-sm">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-bold text-white shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-200 transition-all ${isLoading ? 'opacity-70' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}