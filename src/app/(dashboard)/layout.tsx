import CommonLayout from '@/components/layout/CommonLayout';
import Footer from '@/components/shared/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CommonLayout>{children}</CommonLayout>
      <Footer />
    </>
  );
}
