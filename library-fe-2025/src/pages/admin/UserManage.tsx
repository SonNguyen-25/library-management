import { useState, useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import UserFormModal from "../../components/UserFormModal";
import {userService} from "../../services/userService";
import type {User} from "../../types/user";

export default function UserManage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    // Fetch data
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter Logic
    const filteredUsers = users.filter(u => {
        const matchesSearch =
            (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (u.username?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        // So sánh role (u.role đã được service map ra string)
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Handlers
    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.delete(id);
                fetchUsers();
            } catch (error: any) {
                alert(error.response?.data?.message || "Error deleting user");
            }
        }
    };

    const handleFormSubmit = async (data: any) => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, data);
            } else {
                await userService.create(data);
            }
            fetchUsers();
        } catch (error: any) {
            alert("Error: " + (error.response?.data?.message || error.message));
        }
    };

    // Helper render badge role
    const getRoleBadge = (role?: string) => {
        const styles: {[key: string]: string} = {
            SUPER_ADMIN: "bg-red-100 text-red-800 border border-red-200",
            LIBRARY_MANAGER: "bg-purple-100 text-purple-800 border border-purple-200",
            USER_MANAGER: "bg-blue-100 text-blue-800 border border-blue-200",
            CIRCULATION_MANAGER: "bg-orange-100 text-orange-800 border border-orange-200",
            USER: "bg-green-100 text-green-700 border border-green-200"
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[role || 'USER'] || "bg-gray-100"}`}>{role}</span>;
    };

    return (
        <>
            <title>Manage Users</title>
            <AdminNavbar selected="users" />

            <div className="min-h-screen bg-purple-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-800">Manage Users</h2>
                            <p className="text-gray-600 text-sm">Total: {users.length} users</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <select
                                className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="LIBRARY_MANAGER">Library Manager</option>
                                <option value="USER_MANAGER">User Manager</option>
                                <option value="CIRCULATION_MANAGER">Circulation Manager</option>
                                <option value="USER">User</option>
                            </select>
                            <input
                                type="text" placeholder="Search users..."
                                className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button onClick={handleAdd} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md whitespace-nowrap">
                                + Add User
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead className="bg-purple-100 text-purple-800 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-purple-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{user.name}</p>
                                                    <p className="text-xs text-gray-500">@{user.username} | {user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                        <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {user.status}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(user.joinedDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Edit</button>
                                            {/* Không cho phép xóa Super Admin */}
                                            {user.role !== 'SUPER_ADMIN' && (
                                                <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingUser}
            />
        </>
    );
}