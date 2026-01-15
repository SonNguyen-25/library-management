import {useEffect, useState} from 'react';
import UserNavbar from '../../components/UserNavbar';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';

export default function UserProfile() {
    const { user, updateUser } = useAuth();
    // State Edit Profile
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    // State Change Password Modal
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        if (user) {
            setEditedName(user.name || '');
            setEditedEmail(user.email || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            const updatedUserResponse = await userService.updateProfile({
                name: editedName,
                email: editedEmail
            });

            // Cập nhật lại Context
            updateUser(updatedUserResponse);
            alert('Cập nhật thông tin thành công!');
            setIsEditingProfile(false);
        } catch (error: any) {
            alert("Lỗi: " + (error.response?.data?.message || "Cập nhật thất bại"));
        }
    };

    const handleChangePasswordSubmit = async () => {
        if (passData.newPassword !== passData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            await userService.changePassword(passData);
            alert('Đổi mật khẩu thành công!');
            setIsPassModalOpen(false);
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            alert("Lỗi: " + (error.response?.data?.message || "Đổi mật khẩu thất bại"));
        }
    };

    if (!user) {
        return (
            <>
                <UserNavbar selected="profile" />
                <div className="min-h-screen bg-blue-50 p-6">
                    <div className="text-center py-10">Loading profile...</div>
                </div>
            </>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <>
            <title>My Profile</title>
            <UserNavbar selected="profile" />

            <div className="min-h-screen bg-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Profile</h2>
                    <p className="text-gray-700 mb-6">
                        View and edit your profile information.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* PROFILE INFO CARD */}
                        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-blue-700">Profile Information</h3>
                                {!isEditingProfile && (
                                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition" onClick={() => setIsEditingProfile(true)}>Edit</button>
                                )}
                            </div>

                            {isEditingProfile ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 outline-none" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                                    </div>
                                    <div className="flex space-x-3 pt-2">
                                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" onClick={handleSaveProfile}>Save Changes</button>
                                        <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition" onClick={() => { setEditedName(user.name); setEditedEmail(user.email || ''); setIsEditingProfile(false); }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border-b pb-3 border-gray-100">
                                        <p className="text-sm text-gray-500">Username</p>
                                        <p className="font-medium text-gray-900">{user.username}</p>
                                    </div>
                                    <div className="border-b pb-3 border-gray-100">
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                    </div>
                                    <div className="border-b pb-3 border-gray-100">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{user.email || 'No email'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Member Since</p>
                                        <p className="font-medium text-gray-900">{formatDate(user.joinedDate)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CHANGE PASSWORD CARD */}
                        <div className="bg-white shadow-md rounded-lg p-6 h-fit">
                            <h3 className="text-lg font-semibold text-blue-700 mb-4">Change Password</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Ensure your account is secure by using a strong password.
                            </p>
                            <button
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                onClick={() => setIsPassModalOpen(true)}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CHANGE PASSWORD */}
            {isPassModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={passData.currentPassword}
                                    onChange={e => setPassData({...passData, currentPassword: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={passData.newPassword}
                                    onChange={e => setPassData({...passData, newPassword: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={passData.confirmPassword}
                                    onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsPassModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePasswordSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}