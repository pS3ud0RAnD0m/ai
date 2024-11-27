"use client";

import clsx from "clsx";
import React, { forwardRef } from "react";
import { TouchTarget } from "./button";
import { Link } from "./link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import for current path detection

export function Navbar({
                           className,
                           ...props
                       }: React.ComponentPropsWithoutRef<"nav">) {
    const pathname = usePathname(); // Get the current path

    return (
        <nav
            {...props}
            className={clsx(
                className,
                "flex items-center justify-between gap-4 py-4 px-4"
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
                <NavbarLinkItem href="/" current={pathname === "/"}>
                    Home
                </NavbarLinkItem>
                <NavbarLinkItem href="/llm" current={pathname === "/llm"}>
                    LLM
                </NavbarLinkItem>
                <NavbarLinkItem href="/diffusion" current={pathname === "/diffusion"}>
                    Diffusion
                </NavbarLinkItem>
                <NavbarLinkItem href="/tinker" current={pathname === "/tinker"}>
                    Tinker
                </NavbarLinkItem>
                <NavbarLinkItem href="/references" current={pathname === "/references"}>
                    References
                </NavbarLinkItem>
            </div>

            {/* Settings LinkItem on Far Right */}
            <div className="flex items-center">
                <NavbarLinkItem href="/settings" current={pathname === "/settings"}>
                    Settings
                </NavbarLinkItem>
            </div>
        </nav>
    );
}

// Separate component for link items
type NavbarLinkItemProps = React.PropsWithChildren<
    { current?: boolean } & React.ComponentPropsWithoutRef<typeof Link>
>;

export const NavbarLinkItem = React.memo(
    forwardRef<HTMLAnchorElement, NavbarLinkItemProps>(
        ({ current = false, className, children, href, ...props }, ref) => {
            const classes = clsx(
                "flex items-center gap-2 text-sm font-medium transition",
                current
                    ? "text-green-600" // Green text for the current page
                    : "text-red-600 hover:font-bold hover:bg-gray-800/50", // Default red, bold and lighter background on hover
                className
            );

            return (
                <Link
                    {...props}
                    href={href}
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

export const NavbarButtonItem = React.memo(
    forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
        ({ className, children, ...props }, ref) => {
            const classes = clsx(
                "flex items-center gap-2 text-sm font-medium transition",
                "text-red-600 hover:font-bold hover:bg-gray-800/50",
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

export function NavbarLabel({
                                className,
                                ...props
                            }: React.ComponentPropsWithoutRef<"span">) {
    return <span {...props} className={clsx(className, "truncate")} />;
}
