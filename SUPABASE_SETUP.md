# Setup Supabase cho Money Tracker

## Bước 1: Tạo Project Supabase

1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký/đăng nhập tài khoản
3. Tạo project mới
4. Chọn database password và region

## Bước 2: Lấy thông tin kết nối

1. Vào **Settings** → **API**
2. Copy **Project URL** và **anon/public key**

## Bước 3: Cấu hình Environment Variables

Tạo file `.env.local` với nội dung:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Bước 4: Tạo Database Schema

Vào **SQL Editor** trong Supabase Dashboard và chạy:

```sql
-- Tạo bảng transactions
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tạo RLS (Row Level Security) policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy cho SELECT: User chỉ có thể xem transactions của mình
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy cho INSERT: User chỉ có thể thêm transactions cho mình
CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy cho UPDATE: User chỉ có thể cập nhật transactions của mình
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy cho DELETE: User chỉ có thể xóa transactions của mình
CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
```

## Bước 5: Cấu hình Authentication

1. Vào **Authentication** → **Settings**
2. Cấu hình email templates nếu cần
3. Để enable Google OAuth:
   - Vào **Authentication** → **Providers**
   - Enable Google provider
   - Thêm Google Client ID và Secret

## Bước 6: Cấu hình Auth Callback

Tạo file `/src/app/auth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL('/login?error=auth_error', request.url)
      );
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

## Bước 7: Test Migration

1. Chạy `npm run dev`
2. Test đăng ký tài khoản mới
3. Test đăng nhập
4. Test thêm/xem transactions
5. Test đăng xuất

## Lưu ý quan trọng

- Supabase sử dụng Row Level Security (RLS) để bảo mật data
- Mỗi user chỉ có thể truy cập data của chính mình
- Google OAuth redirect URL: `https://your-domain.com/auth/callback`
- Để development: `http://localhost:3000/auth/callback`

## Troubleshooting

### Lỗi "Invalid JWT"

- Kiểm tra SUPABASE_ANON_KEY có đúng không
- Kiểm tra thời gian hệ thống có chính xác không

### Lỗi "RLS policy violation"

- Đảm bảo đã enable RLS và tạo policies
- Kiểm tra user_id có được set đúng không

### Lỗi Google OAuth

- Kiểm tra redirect URL trong Google Console
- Kiểm tra domain được add vào authorized domains
