# Cấu trúc thư mục ứng dụng My Money Tracker

## 📁 Cấu trúc thư mục

```
src/app/
├── layout.tsx                    # Layout chính của ứng dụng
├── page.tsx                     # Trang chủ (Homepage)
├── globals.css                  # CSS toàn cục
├── favicon.ico                  # Icon trang web
│
├── login/                       # 📄 Trang đăng nhập
│   └── page.tsx                # Giao diện đăng nhập
│
├── register/                    # 📄 Trang đăng ký
│   └── page.tsx                # Giao diện đăng ký
│
├── dashboard/                   # 📊 Trang tổng quan
│   └── page.tsx                # Dashboard với thống kê
│
└── transactions/               # 💰 Trang quản lý giao dịch
    └── page.tsx                # Danh sách giao dịch
```

## 🏷️ Quy tắc đặt tên

### 1. **Tên thư mục = Tên trang**

-   `login/` → Trang đăng nhập
-   `register/` → Trang đăng ký
-   `dashboard/` → Trang tổng quan
-   `transactions/` → Trang giao dịch

### 2. **File bắt buộc trong mỗi thư mục**

-   `page.tsx` - Component chính của trang

### 3. **URL tương ứng**

-   `/` → Trang chủ
-   `/login` → Trang đăng nhập
-   `/register` → Trang đăng ký
-   `/dashboard` → Trang tổng quan
-   `/transactions` → Trang giao dịch

## 📝 Metadata

Metadata chung được định nghĩa trong `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
    title: "My Money Tracker - Quản lý tài chính cá nhân",
    description: "Ứng dụng quản lý tài chính cá nhân thông minh",
};
```

## 🎨 Component Structure

### Layout chung (`layout.tsx`)

-   ThemeProvider
-   Fonts (Geist Sans, Geist Mono)
-   Metadata chung

### Layout chung

-   Metadata chung cho toàn bộ ứng dụng
-   ThemeProvider và fonts

### Page component

-   Giao diện chính của trang
-   Logic xử lý
-   State management

## 🔧 Cách thêm trang mới

1. **Tạo thư mục mới**: `src/app/ten-trang/`
2. **Tạo `page.tsx`**: Component chính
3. **Truy cập**: `http://localhost:3000/ten-trang`

## 📱 Responsive Design

Tất cả trang đều hỗ trợ:

-   Mobile (320px+)
-   Tablet (768px+)
-   Desktop (1024px+)

## 🌙 Dark Mode

Tất cả trang đều hỗ trợ dark mode với:

-   ThemeProvider
-   CSS variables
-   Tailwind dark: classes

