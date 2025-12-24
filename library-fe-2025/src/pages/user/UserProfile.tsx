import { useState } from 'react';
import UserNavbar from '../../components/UserNavbar';
import authService from '../../services/authService';

export default function UserProfile() {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    
    const user = authService.getCurrentUser();
    const profile = user ? {
        userName: user.username,
        name: user.name,
        email: `${user.username}@example.com`,
        createdAt: new Date().toISOString()
    } : null;
    
    if (profile && !editedName) {
        setEditedName(profile.name);
        setEditedEmail(profile.email);
    }
    
    const handleSaveProfile = () => {
        alert('Tính năng cập nhật profile đang được phát triển. Vui lòng quay lại sau!');
        setIsEditingProfile(false);
    };
    
    const handleChangePassword = () => {
        alert('Tính năng đổi mật khẩu đang được phát triển. Vui lòng quay lại sau!');
    };
    
    if (!profile) {
        return (
            <>
                <UserNavbar selected="profile" />
                <div className="min-h-screen bg-blue-50 p-6">
                    <div className="text-center py-10">
                        <p className="text-red-600">Profile not found</p>
                    </div>
                </div>
            </>
        );
    }
    
    return (
        <>
            <title>My Profile</title>
            <UserNavbar selected="profile" />
            
            <div className="min-h-screen bg-blue-50 p-6">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Profile</h2>
                <p className="text-gray-700 mb-6">
                    View and edit your profile information.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-blue-700">Profile Information</h3>
                            {!isEditingProfile && (
                                <button 
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => {
                                        setIsEditingProfile(true);
                                        setEditedName(profile.name);
                                        setEditedEmail(profile.email);
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        
                        {isEditingProfile ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        value={editedEmail}
                                        onChange={(e) => setEditedEmail(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex space-x-3">
                                    <button 
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        onClick={handleSaveProfile}
                                    >
                                        Save Changes
                                    </button>
                                    <button 
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                        onClick={() => {
                                            setEditedName(profile.name);
                                            setEditedEmail(profile.email);
                                            setIsEditingProfile(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="border-b pb-3">
                                    <p className="text-sm text-gray-600">Username</p>
                                    <p className="font-medium text-gray-900">{profile.userName}</p>
                                </div>
                                
                                <div className="border-b pb-3">
                                    <p className="text-sm text-gray-600">Full Name</p>
                                    <p className="font-medium text-gray-900">{profile.name}</p>
                                </div>
                                
                                <div className="border-b pb-3">
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{profile.email}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(profile.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-700 mb-4">Change Password</h3>
                        
                        <div>
                            <p className="text-gray-600 mb-4">
                                Your password should be at least 8 characters long and include a mix of letters, numbers, and special characters.
                            </p>
                            <button 
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleChangePassword}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
