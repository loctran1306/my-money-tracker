import { CreditCard, Home, List, Settings } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Trang chủ' },
  { href: '/transactions', icon: CreditCard, label: 'Giao dịch' },
  { href: '/categories', icon: List, label: 'Danh mục' },
  { href: '/settings', icon: Settings, label: 'Cài đặt' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition-colors px-2 py-1"
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
