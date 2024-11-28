"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";

export function SidebarLayout({
                                  children,
                              }: React.PropsWithChildren<object>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-100 dark:bg-gray-800">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 bg-white dark:bg-gray-900">{children}</main>
        </div>
    );
}
