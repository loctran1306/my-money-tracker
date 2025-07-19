import { toast } from 'sonner';

// Custom toast functions với cấu hình mặc định
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      position: 'top-right',
      duration: 4000,
      style: {
        background: '#10b981',
        color: 'white',
        border: 'none',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      position: 'top-right',
      duration: 4000,
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
      },
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      position: 'top-right',
      duration: 4000,
      style: {
        background: '#f59e0b',
        color: 'white',
        border: 'none',
      },
    });
  },

  info: (message: string) => {
    toast.info(message, {
      position: 'top-right',
      duration: 4000,
      style: {
        background: '#3b82f6',
        color: 'white',
        border: 'none',
      },
    });
  },
};
