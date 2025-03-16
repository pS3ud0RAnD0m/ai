"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import Image from "next/image";

export function SidebarLayout({ children }: React.PropsWithChildren<object>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showSidebarContent, setShowSidebarContent] = useState(true);

    const toggleSidebar = () => {
        if (isSidebarOpen) {
            setShowSidebarContent(false); // Hide content immediately
            setTimeout(() => setIsSidebarOpen(false), 0); // Collapse immediately
        } else {
            setIsSidebarOpen(true); // Expand immediately
            setTimeout(() => setShowSidebarContent(true), 0); // Show content when fully expanded
        }
    };

    return (
        <div className="relative flex h-screen">
            {/* Sidebar */}
            <div
                className={`fixed h-screen bg-gray-900 border-r border-gray-600 transition-all duration-300 ${
                    isSidebarOpen ? "w-64" : "w-16"
                }`}
            >
                {showSidebarContent && isSidebarOpen && <Sidebar />}
                {/* Sidebar Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full shadow-md"
                >
                    <Image
                        src={
                            isSidebarOpen
                                ? "/assets/images/icons/button-sidebar-toggle-left.png"
                                : "/assets/images/icons/button-sidebar-toggle-right.png"
                        }
                        alt="Sidebar Toggle"
                        width={24}
                        height={24}
                        priority
                    />
                </button>
            </div>

            {/* Main Content */}
            <main
                className={`flex-1 p-4 bg-black transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-16"
                }`}
            >
                {children}
            </main>
        </div>
    );
}
