import { MONTHS } from '@/constants';
import { FilterContext } from '@/contexts/FilterContext';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout as logoutThunk } from '@/store/slices/userSlice';
import { ChevronDown, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import IconButton from './IconButton';
import { ModeToggle } from './mode-toggle';

type HeaderProps = {
  isOpen: boolean;
  handleToggleSidebar: () => void;
};
const Header = ({ isOpen, handleToggleSidebar }: HeaderProps) => {
  const { monthSelected, setMonthSelected } = useContext(FilterContext);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      router.push('/login');
    } catch (error: unknown) {
      if (error) {
        toast.error('Đăng xuất thất bại', {
          position: 'top-right',
          style: {
            color: 'red',
          },
        });
      }
    }
  };

  const handleMonthChange = (value: string) => {
    setMonthSelected(value);
  };
  return (
    <div className="flex items-center gap-2 p-4 justify-between">
      {user && (
        <IconButton
          onClick={handleToggleSidebar}
          icon={isOpen ? <ChevronLeft /> : <ChevronRight />}
        />
      )}
      <div className="flex items-center gap-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-8 justify-between text-left text-sm"
              >
                {MONTHS.find((m) => m.value === monthSelected)?.label ||
                  'Tháng'}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-full min-w-[120px] max-h-[300px] overflow-y-auto"
              align="start"
            >
              <DropdownMenuSeparator />

              {MONTHS.map((month) => (
                <DropdownMenuItem
                  key={month.value}
                  onClick={() => handleMonthChange(month.value)}
                  className={`cursor-pointer ${
                    month.value === monthSelected
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : ''
                  }`}
                >
                  {month.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ModeToggle />
        {user && <IconButton onClick={handleLogout} icon={<LogOut />} />}
      </div>
    </div>
  );
};

export default Header;
