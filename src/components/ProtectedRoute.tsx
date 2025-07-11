"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

// Danh sách các trang công khai không cần đăng nhập
const publicRoutes = ["/login/", "/"];

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Kiểm tra xem trang hiện tại có phải là trang công khai không
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!loading) {
            if (!user && !isPublicRoute) {
                // Nếu chưa đăng nhập và không phải trang công khai -> chuyển về login
                router.replace("/login");
            } else if (user && isPublicRoute) {
                // Nếu đã đăng nhập và đang ở trang công khai -> chuyển về dashboard
                // Thêm delay nhỏ để tránh chuyển hướng quá nhanh
                router.replace("/dashboard");
            }
        }
    }, [user, loading, router, pathname, isPublicRoute]);

    // Nếu đang loading và là trang công khai -> hiển thị nội dung ngay
    if (loading && isPublicRoute) {
        return <>{children}</>;
    }

    // Nếu đang loading và không phải trang công khai -> hiển thị loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Nếu là trang công khai hoặc đã đăng nhập -> hiển thị nội dung
    if (isPublicRoute || user) {
        return <>{children}</>;
    }

    // Nếu chưa đăng nhập và không phải trang công khai -> không hiển thị gì
    return null;
};

