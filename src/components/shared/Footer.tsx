'use client';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/redux';
import { checkAndRefreshSession } from '@/lib/supabase-auth';
import { selectUser, selectUserLoading } from '@/store/selectors/userSelectors';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const [refreshing, setRefreshing] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<string>('');
  const [showSessionTest, setShowSessionTest] = useState(false);

  const handleRefreshSession = async () => {
    setRefreshing(true);
    try {
      const { user: refreshedUser, error } = await checkAndRefreshSession();
      if (error) {
        setSessionInfo(`Lỗi: ${error}`);
      } else if (refreshedUser) {
        setSessionInfo(
          `Session refreshed! User: ${refreshedUser.email}, ID: ${refreshedUser.id}`
        );
      } else {
        setSessionInfo('Không có user đăng nhập');
      }
    } catch (error) {
      setSessionInfo(`Lỗi: ${error}`);
    }
    setRefreshing(false);
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 My Money Tracker. Được phát triển bởi Thanh Lộc
          </div>

          {/* Session Test Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSessionTest(!showSessionTest)}
              className="text-xs"
            >
              {showSessionTest ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              Debug Info
            </Button>
          </div>
        </div>

        {/* Session Test Panel */}
        {showSessionTest && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Debug Info
            </h3>

            {loading ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang kiểm tra session...
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Trạng thái:
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        user
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {user ? 'Đã đăng nhập' : 'Chưa đăng nhập'}
                    </span>
                  </div>
                  {user && (
                    <>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Email:
                        </span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Verified:
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            user.email_confirmed_at
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}
                        >
                          {user.email_confirmed_at ? 'Có' : 'Không'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleRefreshSession}
                    disabled={refreshing}
                    size="sm"
                    variant="outline"
                  >
                    {refreshing ? 'Đang refresh...' : 'Refresh Token'}
                  </Button>

                  {user && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {user.id.substring(0, 8)}...
                    </span>
                  )}
                </div>

                {sessionInfo && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-blue-800 dark:text-blue-200 text-xs">
                      {sessionInfo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
