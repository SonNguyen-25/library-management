import { useState, useEffect } from "react";
import type {User, UserRole} from "../data/users";

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: User | null;
}

export default function UserFormModal({ isOpen, onClose, onSubmit, initialData }: UserFormModalProps) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // Chỉ dùng khi tạo mới hoặc đổi pass
    const [role, setRole] = useState<UserRole>("USER");
    const [status, setStatus] = useState<"Active" | "Inactive" | "Banned">("Active");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setUsername(initialData.username);
            setEmail(initialData.email);
            setRole(initialData.role);
            setStatus(initialData.status);
            setPassword(""); // Reset pass khi edit
        } else {
            setName("");
            setUsername("");
            setEmail("");
            setPassword("");
            setRole("USER");
            setStatus("Active");
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userData: any = {
            name,
            username,
            email,
            role,
            status
        };

        // Nếu là thêm mới HOẶC có nhập password khi edit thì mới gửi field password
        if (!initialData || password) {
            userData.password = password;
        }

        onSubmit(userData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50 rounded-t-xl">
                    <h2 className="text-xl font-bold text-purple-800">
                        {initialData ? "Edit User" : "Add New User"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input required disabled={!!initialData} type="text" value={username} onChange={e => setUsername(e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none disabled:bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                                <option value="USER">User</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {initialData && <span className="text-gray-400 font-normal">(Leave blank to keep)</span>}
                        </label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                               required={!initialData} // Bắt buộc nếu là thêm mới
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Banned">Banned</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-md">
                            {initialData ? "Save Changes" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}