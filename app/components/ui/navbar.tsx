"use client";

import clsx from "clsx";
import React, { forwardRef, useState } from "react";
import { TouchTarget } from "./button";
import { Link } from "./link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar({
                           className,
                           ...props
                       }: React.ComponentPropsWithoutRef<"nav">) {
    const pathname = usePathname(); // Get the current path
    const [activePath, setActivePath] = useState(pathname); // Track active link

    const handleLinkClick = (href: string) => {
        setActivePath(href); // Update active link immediately on click
    };

    return (
        <nav
            {...props}
            className={clsx(
                className,
                "flex items-center justify-between gap-4 py-4 px-4 bg-gray-900 border-b border-gray-600"
            )}
        >
            {/* App Icon and Name */}
            <div className="flex items-center gap-2">
                <Image
                    src="/favicon.ico"
                    alt="App Icon"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                />
                <NavbarLabel className="text-red-600 text-lg font-bold">AI</NavbarLabel>
            </div>

            {/* Centered Navbar Links */}
            <div className="flex items-center gap-16">
                <NavbarLinkItem
                    href="/"
                    current={activePath === "/"}
                    onClick={() => handleLinkClick("/")}
                >
                    Home
                </NavbarLinkItem>
                <NavbarLinkItem
                    href="/llms"
                    current={activePath === "/llms"}
                    onClick={() => handleLinkClick("/llms")}
                >
                    LLMs
                </NavbarLinkItem>
                <NavbarLinkItem
                    href="/diffusions"
                    current={activePath === "/diffusions"}
                    onClick={() => handleLinkClick("/diffusions")}
                >
                    Diffusions
                </NavbarLinkItem>
                <NavbarLinkItem
                    href="/tinker"
                    current={activePath === "/tinker"}
                    onClick={() => handleLinkClick("/tinker")}
                >
                    Tinker
                </NavbarLinkItem>
                <NavbarLinkItem
                    href="/references"
                    current={activePath === "/references"}
                    onClick={() => handleLinkClick("/references")}
                >
                    References
                </NavbarLinkItem>
            </div>

            {/* Settings LinkItem on Far Right */}
            <div className="flex items-center">
                <NavbarLinkItem
                    href="/settings"
                    current={activePath === "/settings"}
                    onClick={() => handleLinkClick("/settings")}
                >
                    Settings
                </NavbarLinkItem>
            </div>
        </nav>
    );
}

// Separate component for button items
export const NavbarButtonItem = React.memo(
    forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
        ({ className, children, ...props }, ref) => {
            const classes = clsx(
                "flex items-center gap-2 text-sm font-bold transition",
                "text-red-600 hover:underline hover:underline-offset-4 hover:decoration-green-600",
                className
            );

            return (
                <button {...props} className={classes} ref={ref}>
                    {children}
                </button>
            );
        }
    )
);

// Separate component for link items
type NavbarLinkItemProps = React.PropsWithChildren<
    { current?: boolean; onClick?: () => void } & React.ComponentPropsWithoutRef<typeof Link>
>;

export const NavbarLinkItem = React.memo(
    forwardRef<HTMLAnchorElement, NavbarLinkItemProps>(
        ({ current = false, className, children, href, onClick, ...props }, ref) => {
            const classes = clsx(
                "flex items-center gap-2 text-sm font-bold transition",
                current
                    ? "text-green-600"
                    : "text-red-600 hover:underline hover:underline-offset-4 hover:decoration-green-600",
                className
            );

            return (
                <Link
                    {...props}
                    href={href}
                    onClick={onClick} // Trigger onClick when the link is clicked
                    className={classes}
                    data-current={current ? "true" : undefined}
                    ref={ref}
                >
                    <TouchTarget>{children}</TouchTarget>
                </Link>
            );
        }
    )
);

export function NavbarLabel({
                                className,
                                ...props
                            }: React.ComponentPropsWithoutRef<"span">) {
    return <span {...props} className={clsx(className, "truncate")} />;
}
