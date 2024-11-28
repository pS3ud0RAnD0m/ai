"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";

export function SidebarLayout({
                                  children,
                              }: React.PropsWithChildren<object>) {
    const [isPrimarySidebarOpen, setIsPrimarySidebarOpen] = useState(true);
    const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false); // Default collapsed
    const [showPrimaryContent, setShowPrimaryContent] = useState(true);
    const [showSecondaryContent, setShowSecondaryContent] = useState(false); // Default hidden

    const togglePrimarySidebar = () => {
        if (isPrimarySidebarOpen) {
            setShowPrimaryContent(false); // Hide content immediately
            setTimeout(() => setIsPrimarySidebarOpen(false), 0); // Collapse immediately
        } else {
            setIsPrimarySidebarOpen(true); // Expand immediately
            setTimeout(() => setShowPrimaryContent(true), 0); // Show content when fully expanded
        }
    };

    const toggleSecondarySidebar = () => {
        if (isSecondarySidebarOpen) {
            setShowSecondaryContent(false); // Hide content immediately
            setTimeout(() => setIsSecondarySidebarOpen(false), 0); // Collapse immediately
        } else {
            setIsSecondarySidebarOpen(true); // Expand immediately
            setTimeout(() => setShowSecondaryContent(true), 0); // Show content when fully expanded
        }
    };

    return (
        <div className="relative flex h-screen">
            {/* Primary Sidebar */}
            <div
                className={`${
                    isPrimarySidebarOpen ? "w-64" : "w-16"
                } bg-gray-100 dark:bg-gray-800 relative`}
            >
                {showPrimaryContent && isPrimarySidebarOpen && (
                    <Sidebar toggleSidebar={togglePrimarySidebar} />
                )}
                {/* Primary Sidebar Toggle Button */}
                <button
                    onClick={togglePrimarySidebar}
                    className="absolute top-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-white shadow-md hover:bg-gray-600"
                >
                    {isPrimarySidebarOpen ? "<" : ">"}
                </button>
            </div>

            {/* Secondary Sidebar */}
            <div
                className={`${
                    isSecondarySidebarOpen ? "w-64" : "w-16"
                } bg-gray-200 dark:bg-gray-700 relative`}
            >
                {showSecondaryContent && isSecondarySidebarOpen && (
                    <SecondarySidebar toggleSidebar={toggleSecondarySidebar} />
                )}
                {/* Secondary Sidebar Toggle Button */}
                <button
                    onClick={toggleSecondarySidebar}
                    className="absolute top-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-white shadow-md hover:bg-gray-600"
                >
                    {isSecondarySidebarOpen ? "<" : ">"}
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 bg-white dark:bg-gray-900">{children}</main>
        </div>
    );
}

function SecondarySidebar({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                Conversations
            </h3>
            <ul className="space-y-2">
                <li className="text-sm text-gray-600 dark:text-gray-400">
                    <a href="#" className="hover:text-blue-500">
                        Placeholder conversation 1
                    </a>
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400">
                    <a href="#" className="hover:text-blue-500">
                        Placeholder conversation 2
                    </a>
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400">
                    <a href="#" className="hover:text-blue-500">
                        Placeholder conversation 3
                    </a>
                </li>
            </ul>
        </div>
    );
}
