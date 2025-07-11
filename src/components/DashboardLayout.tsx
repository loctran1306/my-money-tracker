"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Page Content */}
                {sidebarOpen && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    </div>
                )}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

