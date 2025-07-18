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
