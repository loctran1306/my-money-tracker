import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch } from '@/hooks/redux';
import { setTransactionEdit } from '@/store/slices/transactionSlice';
import { CreditCard, Home, List, Plus, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import CardTransaction from '../transaction/CardTransaction';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import IconButton from './IconButton';

const navItems = [
  { href: '/dashboard/', icon: Home, label: 'Trang chủ' },
  { href: '/transactions/', icon: CreditCard, label: 'Giao dịch' },
  { href: '/stats/', icon: Plus, label: '' },
  { href: '/categories/', icon: List, label: 'Danh mục' },
  { href: '/settings/', icon: Settings, label: 'Cài đặt' },
];

export default function BottomNav() {
  const { openTransactionForm, setOpenTransactionForm } =
    useContext(FilterContext);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isActive = (href: string) => pathname === href;
  return (
    <nav className="fixed bottom-0 left-0 right-0  z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between items-start h-17 md:hidden">
      {navItems.map((item) => {
        if (item.href === '/stats/') {
          return (
            <div key={item.href} className="flex justify-center p-2">
              <Popover
                open={openTransactionForm}
                onOpenChange={(open) => {
                  setOpenTransactionForm(open);
                  if (!open) {
                    dispatch(setTransactionEdit(null));
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    style={{
                      color: openTransactionForm ? 'red' : 'green',
                    }}
                    variant="outline"
                    className="rounded-xl w-10 h-10 cursor-pointer"
                  >
                    {openTransactionForm ? <X size={16} /> : <Plus size={16} />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-96 p-0 rounded-full sm:hidden mb-1"
                  align="center"
                  side="top"
                >
                  <CardTransaction />
                </PopoverContent>
              </Popover>
            </div>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`min-w-20 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition-colors p-2`}
          >
            <IconButton
              icon={<item.icon />}
              size="lg"
              style={{
                color: isActive(item.href) ? 'green' : 'gray',
                borderColor: isActive(item.href) ? 'green' : '',
              }}
              title={item.label}
            />
            {/* <item.icon
              className={`w-6 h-6 mb-1 ${isActive(item.href) ? 'text-green-500' : 'text-gray-500 dark:text-gray-400 hover:text-green-500'}`}
            />
            <span
              className={`text-xs font-medium ${isActive(item.href) ? 'text-green-500' : 'text-gray-500 dark:text-gray-400 hover:text-green-500'}`}
            >
              {item.label}
            </span> */}
          </Link>
        );
      })}
    </nav>
  );
}
