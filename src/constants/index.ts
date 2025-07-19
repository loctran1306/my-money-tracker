// src/constants/index.ts

// API endpoints
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// Roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Messages
export const MESSAGES = {
  ERROR_UNKNOWN: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
  LOGIN_REQUIRED: 'Bạn cần đăng nhập để tiếp tục.',
  SUCCESS: 'Thành công!',
};

// App settings
export const APP_NAME = 'My Money Tracker';
export const DEFAULT_LANGUAGE = 'vi';

export const STATS_MENU = {
  INCOME: 'income',
  EXPENSE: 'expense',
  BALANCE: 'balance',
  TRANSACTION: 'transaction',
};

export const STATS_MENU_TITLE = {
  [STATS_MENU.INCOME]: 'Thu nhập',
  [STATS_MENU.EXPENSE]: 'Chi tiêu',
  [STATS_MENU.BALANCE]: 'Số dư',
  [STATS_MENU.TRANSACTION]: 'Giao dịch',
};

export const MONTHS = [
  { value: 'Jan', label: 'Tháng 1', index: 0 },
  { value: 'Feb', label: 'Tháng 2', index: 1 },
  { value: 'Mar', label: 'Tháng 3', index: 2 },
  { value: 'Apr', label: 'Tháng 4', index: 3 },
  { value: 'May', label: 'Tháng 5', index: 4 },
  { value: 'Jun', label: 'Tháng 6', index: 5 },
  { value: 'Jul', label: 'Tháng 7', index: 6 },
  { value: 'Aug', label: 'Tháng 8', index: 7 },
  { value: 'Sep', label: 'Tháng 9', index: 8 },
  { value: 'Oct', label: 'Tháng 10', index: 9 },
  { value: 'Nov', label: 'Tháng 11', index: 10 },
  { value: 'Dec', label: 'Tháng 12', index: 11 },
  { value: 'All', label: 'Tất cả', index: 12 },
];
