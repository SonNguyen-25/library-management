package com.example.libraryBe.model;

public enum PermissionEnum {
    // --- Quyền Quản lý Sách (Dành cho Library Manager) ---
    BOOK_READ("Xem danh sách sách"),
    BOOK_CREATE("Thêm sách mới"),
    BOOK_UPDATE("Cập nhật thông tin sách"),
    BOOK_DELETE("Xóa sách"),

    // --- Quyền Quản lý Danh mục (Tác giả, NXB...) ---
    CATEGORY_MANAGE("Quản lý danh mục"),
    AUTHOR_MANAGE("Quản lý tác giả"),

    // --- Quyền Quản lý Độc giả (Dành cho User Manager) ---
    USER_READ("Xem danh sách người dùng"),
    USER_UPDATE("Sửa thông tin người dùng"),
    USER_BAN("Khóa/Mở khóa tài khoản"),

    // --- Quyền Quản lý Lưu thông (Dành cho Circulation Manager) ---
    LOAN_READ("Xem danh sách mượn trả"),
    LOAN_APPROVE("Duyệt yêu cầu mượn"),
    LOAN_RETURN("Xác nhận trả sách"),
    FINE_MANAGE("Quản lý phạt tiền"), // Tạo/Xóa phạt

    // --- Quyền Hệ thống (Dành cho Super Admin) ---
    ADMIN_CREATE("Tạo tài khoản nhân viên"),
    DASHBOARD_VIEW("Xem thống kê tổng quan");

    private final String description;

    PermissionEnum(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
