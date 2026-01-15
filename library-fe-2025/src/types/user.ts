export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    status: 'Active' | 'Inactive' | 'Banned';
    joinedDate: string;
    avatarUrl?: string;
    // Backend trả về mảng roles: [{id: 1, name: "SUPER_ADMIN"}]
    roles: { name: string }[];
    // Helper property hiển thị cho dễ
    role?: string;
}