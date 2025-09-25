import { ProtectedRoute } from '@/components/ProtectedRoute';
import StoreProvider from '@/components/StoreProvider';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { FilterProvider } from '@/contexts/FilterContext';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'My Money Tracker - Quản lý tài chính cá nhân',
  description:
    'Ứng dụng quản lý tài chính cá nhân thông minh, giúp theo dõi chi tiêu và tiết kiệm hiệu quả',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  // Hoặc tùy biến theo theme hệ thống:
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  //   { media: '(prefers-color-scheme: dark)', color: '#000000' },
  // ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <FilterProvider>
                <ProtectedRoute>{children}</ProtectedRoute>
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  duration={4000}
                />
              </FilterProvider>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
