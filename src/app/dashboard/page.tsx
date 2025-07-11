"use client";

import { Button } from "@/components/ui/button";
import { PiggyBank, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            {/* Stats Cards */}
            <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm giao dịch
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Thu nhập tháng này</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">15,000,000₫</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chi tiêu tháng này</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">8,500,000₫</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <PiggyBank className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiết kiệm tháng này</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">6,500,000₫</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Số dư hiện tại</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">25,000,000₫</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Giao dịch gần đây</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-gray-900 dark:text-white">Ăn trưa</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Hôm nay</p>
                                </div>
                            </div>
                            <span className="text-red-600 dark:text-red-400 font-semibold">-50,000₫</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-gray-900 dark:text-white">Lương tháng</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Hôm qua</p>
                                </div>
                            </div>
                            <span className="text-green-600 dark:text-green-400 font-semibold">+15,000,000₫</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-gray-900 dark:text-white">Xăng xe</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">2 ngày trước</p>
                                </div>
                            </div>
                            <span className="text-red-600 dark:text-red-400 font-semibold">-200,000₫</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

