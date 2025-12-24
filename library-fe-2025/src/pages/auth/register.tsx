// Trang Register
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password strength validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      alert("Tính năng đăng ký đang được phát triển. Vui lòng quay lại sau!");
      setLoading(false);
    }, 400);
  };

  return (
    // Container chính căn giữa trang, nền gradient xanh dương nhẹ nhàng
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
      {/* Box form đăng ký với background trắng, bo góc, shadow */}
      <div className="bg-white pt-12 pb-8 px-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Tiêu đề trang đăng ký */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create an Account
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Form đăng ký gồm các input nhập thông tin user */}
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Nhập tên */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Nhập tên đăng nhập (username) */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Nhập email */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Nhập mật khẩu */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Nút submit đăng ký */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 font-semibold disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Link chuyển về trang đăng nhập nếu đã có tài khoản */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
