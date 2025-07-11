# Cấu hình Firebase cho My Money Tracker

## 📋 Bước 1: Cài đặt Firebase

```bash
npm install firebase
```

## 🔧 Bước 2: Tạo dự án Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo dự án mới hoặc chọn dự án có sẵn
3. Thêm ứng dụng web vào dự án

## 🔑 Bước 3: Lấy thông tin cấu hình

1. Trong Firebase Console, vào **Project Settings**
2. Trong tab **General**, cuộn xuống **Your apps**
3. Chọn ứng dụng web của bạn
4. Copy thông tin cấu hình

## 🌍 Bước 4: Tạo file .env.local

Tạo file `.env.local` trong thư mục gốc của dự án:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🔐 Bước 5: Cấu hình Authentication

1. Trong Firebase Console, vào **Authentication**
2. Chọn tab **Sign-in method**
3. Bật **Email/Password**
4. (Tùy chọn) Bật **Google** để đăng nhập bằng Google

## 🗄️ Bước 6: Cấu hình Firestore Database

1. Trong Firebase Console, vào **Firestore Database**
2. Tạo database mới
3. Chọn **Start in test mode** (cho development)
4. Chọn location gần nhất

### Cấu trúc Database:

```
/users/{userId}
  - email: string
  - name: string
  - createdAt: timestamp
  - updatedAt: timestamp

/transactions/{transactionId}
  - userId: string
  - type: 'income' | 'expense'
  - category: string
  - amount: number
  - description: string
  - date: timestamp
  - createdAt: timestamp
  - updatedAt: timestamp
```

## 🔒 Bước 7: Cấu hình Security Rules

### Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only read/write their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🚀 Bước 8: Test cấu hình

1. Chạy ứng dụng: `npm run dev`
2. Truy cập trang đăng ký: `/register`
3. Tạo tài khoản mới
4. Kiểm tra trong Firebase Console xem user có được tạo không

## 📱 Tính năng đã tích hợp:

### Authentication:

-   ✅ Đăng ký với email/password
-   ✅ Đăng nhập với email/password
-   ✅ Đăng xuất
-   ✅ Reset password
-   ✅ Auth state management

### Database:

-   ✅ CRUD operations cho transactions
-   ✅ CRUD operations cho users
-   ✅ Real-time updates
-   ✅ Security rules

### Components:

-   ✅ AuthContext
-   ✅ ProtectedRoute
-   ✅ Loading states

## 🔧 Troubleshooting:

### Lỗi "Firebase not initialized":

-   Kiểm tra file `.env.local` có đúng thông tin không
-   Đảm bảo tất cả environment variables đều có prefix `NEXT_PUBLIC_`

### Lỗi "Permission denied":

-   Kiểm tra Firestore Security Rules
-   Đảm bảo user đã đăng nhập

### Lỗi "Module not found":

-   Chạy `npm install` để cài đặt dependencies
-   Restart development server

## 📚 Tài liệu tham khảo:

-   [Firebase Documentation](https://firebase.google.com/docs)
-   [Next.js with Firebase](https://nextjs.org/docs/guides/firebase)
-   [Firebase Security Rules](https://firebase.google.com/docs/rules)

