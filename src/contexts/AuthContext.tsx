'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  onAuthStateChange,
  validateUserFromLocalStorage,
} from '@/lib/supabase-auth';
import { selectUser, selectUserLoading } from '@/store/selectors/userSelectors';
import { clearTransactions } from '@/store/slices/transactionSlice';
import { logout as logoutThunk, setUser } from '@/store/slices/userSlice';
import { User } from '@supabase/supabase-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  setUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserRef = useRef<User | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Hàm setUser để cập nhật user trong Redux
  const setUserWrapper = useCallback(
    (user: User | null) => {
      dispatch(setUser(user));
    },
    [dispatch]
  );

  useEffect(() => {
    // Set timeout fallback để đảm bảo loading state được clear
    timeoutRef.current = setTimeout(() => {
      console.log(
        '⏰ AuthProvider: Timeout fallback - setting loading to false'
      );
      dispatch(setUser(null));
    }, 3000);

    // Hàm initialize auth
    const initializeAuth = async () => {
      try {
        // Bước 1: Check localStorage trước
        const { user: cachedUser, needsRefresh } =
          await validateUserFromLocalStorage();

        if (!needsRefresh && cachedUser) {
          // Dùng cached user, không cần API call
          lastUserRef.current = cachedUser;
          dispatch(setUser(cachedUser));

          // Clear timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return;
        }

        // Bước 2: Setup onAuthStateChange chỉ khi cần refresh
        const {
          data: { subscription },
        } = onAuthStateChange((newUser) => {
          const currentUserId = lastUserRef.current?.id;
          const newUserId = newUser?.id;

          if (currentUserId !== newUserId) {
            lastUserRef.current = newUser;

            // Clear timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }

            // Debounce dispatch
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
              dispatch(setUser(newUser));
              debounceRef.current = null;
            }, 100);
          }
        });

        // Cleanup function
        return () => {
          subscription.unsubscribe();
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch(setUser(null));
      }
    };

    // Initialize auth
    let cleanup: (() => void) | undefined;
    initializeAuth().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    // Cleanup function
    return () => {
      if (cleanup) {
        cleanup();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      dispatch(clearTransactions());
      lastUserRef.current = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      setUser: setUserWrapper,
    }),
    [user, loading, logout, setUserWrapper]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
