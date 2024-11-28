"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/app/components/ui/sidebar";

interface LayoutProps {
    children: ReactNode;
}

export default function LLMLayout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100 dark:bg-gray-800">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-gray-900">
                {children}
            </div>
        </div>
    );
}
