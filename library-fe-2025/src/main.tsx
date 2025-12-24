import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import './index.css'

import App from './App.tsx'
import Login from './pages/auth/login.tsx'
import Register from './pages/auth/register.tsx'
import UserProfile from './pages/user/UserProfile.tsx'
import UserBookSearch from './pages/user/UserBookSearch.tsx'
import UserRequest from './pages/user/UserRequest.tsx'
import UserLoaned from './pages/user/UserLoaned.tsx'
import UserFines from './pages/user/UserFines.tsx'
import UserSubscriptions from './pages/user/UserSubscriptions.tsx'
import NotFound from './pages/404.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { AuthProvider } from './components/AuthProvider.tsx'
import UserDashboard from './pages/user/UserDashboard.tsx'
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import BookManage from "./pages/admin/BookManage.tsx";
import UserManage from "./pages/admin/UserManage.tsx";
import RequestsManage from "./pages/admin/RequestsManage.tsx";
import LoansManage from "./pages/admin/LoansManage.tsx";
import FinesManage from "./pages/admin/FinesManage.tsx";
import AuthorManage from "./pages/admin/AuthorManage.tsx";
import CategoryManage from "./pages/admin/CategoryManage.tsx";
import PublisherManage from "./pages/admin/PublisherManage.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Navigate to="/" replace />} />

                    {/* User routes */}
                    <Route path="/user" element={<ProtectedRoute><div><Outlet /></div></ProtectedRoute>}>
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<UserDashboard />} />
                        <Route path="search" element={<UserBookSearch />} />
                        <Route path="loaned" element={<UserLoaned />} />
                        <Route path="requests" element={<UserRequest />} />
                        <Route path="subscriptions" element={<UserSubscriptions />} />
                        <Route path="fines" element={<UserFines />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>

                    {/* Admin routes */}
                    <Route path="/admin" element={<ProtectedRoute><div><Outlet /></div></ProtectedRoute>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="manage/books" element={<BookManage />} />
                        <Route path="manage/categories" element={<CategoryManage />} />
                        <Route path="manage/authors" element={<AuthorManage />} />
                        <Route path="manage/publishers" element={<PublisherManage />} />
                        <Route path="users" element={<UserManage />} />
                        <Route path="requests" element={<RequestsManage />} />
                        <Route path="loans" element={<LoansManage />} />
                        <Route path="fines" element={<FinesManage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
