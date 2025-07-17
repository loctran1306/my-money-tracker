'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bell, Palette, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cài đặt
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý cài đặt tài khoản và hệ thống
        </p>
      </div>

      <div className="space-y-6">
        {/* Giao diện */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Giao diện
            </CardTitle>
            <CardDescription>Tùy chỉnh giao diện và chủ đề</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Chế độ sáng tối
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chuyển đổi giữa chế độ sáng và tối
                </p>
              </div>
              <ModeToggle />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Màu chủ đạo
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chọn màu chủ đạo cho ứng dụng
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Xanh dương
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tài khoản */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Tài khoản
            </CardTitle>
            <CardDescription>
              Quản lý thông tin tài khoản cá nhân
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Email
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  tranthanhloc130600@gmail.com
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Chỉnh sửa
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Mật khẩu
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thay đổi mật khẩu tài khoản
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Thay đổi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Thông báo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Thông báo
            </CardTitle>
            <CardDescription>Cài đặt thông báo và nhắc nhở</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Nhắc nhở giao dịch
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nhắc nhở ghi lại giao dịch hàng ngày
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Bật
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Báo cáo định kỳ
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nhận báo cáo tài chính hàng tuần/tháng
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Tắt
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bảo mật */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Bảo mật
            </CardTitle>
            <CardDescription>Cài đặt bảo mật và quyền riêng tư</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Xác thực 2 yếu tố
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bảo vệ tài khoản bằng xác thực 2 yếu tố
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Thiết lập
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Đăng nhập từ thiết bị khác
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Xem và quản lý phiên đăng nhập
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Xem
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
