'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

// Export default cho tương thích
export default StoreProvider;
