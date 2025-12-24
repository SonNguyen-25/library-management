export type UserRole = 'ADMIN' | 'USER' | 'STAFF';

export interface User {
    id: string;
    username: string;
    password?: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'Active' | 'Inactive' | 'Banned';
    joinedDate: string;
    avatarUrl?: string;
}

const users: User[] = [
    {
        id: '1',
        username: 'johndoe',
        password: 'password',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'USER',
        status: 'Active',
        joinedDate: '2023-01-15T08:30:00Z',
        avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    },
    {
        id: '2',
        username: 'janedoe',
        password: 'password',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'USER',
        status: 'Active',
        joinedDate: '2023-03-20T14:20:00Z',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Doe&background=random'
    },
    {
        id: '99',
        username: 'admin',
        password: 'password',
        name: 'Super Admin',
        email: 'admin@library.com',
        role: 'ADMIN',
        status: 'Active',
        joinedDate: '2022-01-01T00:00:00Z',
        avatarUrl: 'https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff'
    },
    {
        id: '3',
        username: 'staff_01',
        name: 'Library Staff',
        email: 'staff.one@library.com',
        role: 'STAFF',
        status: 'Active',
        joinedDate: '2023-06-10T09:00:00Z',
        avatarUrl: 'https://ui-avatars.com/api/?name=Library+Staff&background=random'
    },
    {
        id: '4',
        username: 'mike_brown',
        name: 'Mike Brown',
        email: 'mike.b@example.com',
        role: 'USER',
        status: 'Inactive',
        joinedDate: '2023-11-05T10:15:00Z',
        avatarUrl: 'https://ui-avatars.com/api/?name=Mike+Brown&background=random'
    }
];

export default users;