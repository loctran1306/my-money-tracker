import CommonLayout from '@/components/layout/CommonLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Footer from '@/components/shared/Footer';
import StoreProvider from '@/components/StoreProvider';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { FilterProvider } from '@/contexts/FilterContext';
import type { Metadata } from 'next';
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
              <ProtectedRoute>
                <FilterProvider>
                  <CommonLayout>{children}</CommonLayout>
                  <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    duration={4000}
                  />
                  <Footer />
                </FilterProvider>
              </ProtectedRoute>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
