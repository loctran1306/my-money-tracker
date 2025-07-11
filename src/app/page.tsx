import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">My Money Tracker</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        Quản lý tài chính cá nhân một cách thông minh và hiệu quả
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Theo dõi chi tiêu</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Ghi chép và phân tích các khoản chi tiêu hàng ngày
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-green-600 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Báo cáo thống kê</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Xem biểu đồ và báo cáo chi tiết về tình hình tài chính
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bảo mật an toàn</h3>
                        <p className="text-gray-600 dark:text-gray-400">Dữ liệu được mã hóa và bảo vệ an toàn</p>
                    </div>
                </div>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <a
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                        href="/login"
                    >
                        <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
                        Đăng nhập
                    </a>
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <ModeToggle />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 My Money Tracker. Được phát triển bởi Thanh Lộc
                </span>
            </footer>
        </div>
    );
}

