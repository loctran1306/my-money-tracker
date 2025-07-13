import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateAllowedEmail } from '@/lib/supabase-auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL('/login?error=auth_error', request.url)
      );
    }

    // Kiểm tra email có được phép không
    if (data.user && !validateAllowedEmail(data.user.email)) {
      // Đăng xuất ngay nếu email không được phép
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL('/login?error=email_not_allowed', request.url)
      );
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
