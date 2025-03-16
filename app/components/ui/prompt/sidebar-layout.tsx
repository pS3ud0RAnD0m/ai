"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "./sidebar";
import Image from "next/image";

export function SidebarLayout({ children }: React.PropsWithChildren<object>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showSidebarContent, setShowSidebarContent] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(250); // Default width (avoids SSR issue)
    const [isResizing, setIsResizing] = useState(false);
    const resizerRef = useRef<HTMLDivElement | null>(null);

    // Set sidebar width dynamically on client after mount
    useEffect(() => {
        setSidebarWidth(window.innerWidth * 0.2); // Default: 20% of screen width
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (!isSidebarOpen) return;
            setSidebarWidth(window.innerWidth * 0.2); // Keep 20% ratio when resizing window
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        if (isSidebarOpen) {
            setShowSidebarContent(false);
            setTimeout(() => {
                setIsSidebarOpen(false);
                setSidebarWidth(64); // Minimized width
            }, 0);
        } else {
            setIsSidebarOpen(true);
            setSidebarWidth(window.innerWidth * 0.2); // Restore to 20% width
            setTimeout(() => setShowSidebarContent(true), 0);
        }
    };

    // Resizing logic (Fix: Now properly adjusts width as cursor moves)
    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !isSidebarOpen) return;
        const newWidth = Math.max(100, Math.min(window.innerWidth * 0.4, e.clientX)); // Limit width between 100px and 40% of screen
        setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="relative flex h-screen">
            {/* Sidebar */}
            <div
                className="h-screen bg-gray-900 border-r border-gray-600 transition-all duration-300 flex-shrink-0 relative"
                style={{ width: `${sidebarWidth}px` }}
            >
                {showSidebarContent && isSidebarOpen && <Sidebar />}

                {/* Sidebar Toggle Button (Restored to Correct Position) */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-2 right-[-15px] z-50 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 shadow-md"
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

            {/* Resizer (Fix: Sidebar now properly resizes) */}
            {isSidebarOpen && (
                <div
                    ref={resizerRef}
                    onMouseDown={handleMouseDown}
                    className="w-4 cursor-ew-resize bg-gray-700 hover:bg-gray-500 transition-all"
                    style={{ marginLeft: "-2px" }} // Keeps resizer aligned
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 bg-black">
                {children}
            </main>
        </div>
    );
}
