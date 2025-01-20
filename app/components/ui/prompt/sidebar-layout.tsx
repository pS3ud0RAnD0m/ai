"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import Image from "next/image";

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
                } bg-gray-900 border-r border-gray-600 relative`}
            >
                {showPrimaryContent && isPrimarySidebarOpen && <Sidebar />}
                {/* Primary Sidebar Toggle Button */}
                <button
                    onClick={togglePrimarySidebar}
                    className="absolute top-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full shadow-md"
                >
                    <Image
                        src={
                            isPrimarySidebarOpen
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

            {/* Secondary Sidebar */}
            <div
                className={`${
                    isSecondarySidebarOpen ? "w-64" : "w-16"
                } bg-gray-950 border-r border-gray-600 relative`}
            >
                {showSecondaryContent && isSecondarySidebarOpen && <SecondarySidebar />}
                {/* Secondary Sidebar Toggle Button */}
                <button
                    onClick={toggleSecondarySidebar}
                    className="absolute top-1 right-1 z-50 flex h-6 w-6 items-center justify-center rounded-full shadow-md"
                >
                    <Image
                        src={
                            isSecondarySidebarOpen
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
            <main className="flex-1 p-4 bg-black">{children}</main>
        </div>
    );
}

function SecondarySidebar() {
    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
                Conversations
            </h3>
            <ul className="space-y-2">
                <li className="text-sm text-gray-600">
                    <a href="#" className="hover:text-green-600">
                        Placeholder conversation 1
                    </a>
                </li>
                <li className="text-sm text-gray-600">
                    <a href="#" className="hover:text-green-600">
                        Placeholder conversation 2
                    </a>
                </li>
                <li className="text-sm text-gray-600">
                    <a href="#" className="hover:text-green-600">
                        Placeholder conversation 3
                    </a>
                </li>
            </ul>
        </div>
    );
}
