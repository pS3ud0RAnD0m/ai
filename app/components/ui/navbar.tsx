"use client";

import { useState } from "react";
import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import React, { forwardRef } from "react";
import { TouchTarget } from "./button";
import { Link } from "./link";

export function Navbar({
                           className,
                           ...props
                       }: React.ComponentPropsWithoutRef<"nav">) {
    return (
        <nav
            {...props}
            className={clsx(
                className,
                "flex items-center justify-center gap-16 py-4 px-4"
            )}
        >
            {/* Original Navbar items */}
            <NavbarLinkItem href="/" current={true}>
                Home
            </NavbarLinkItem>

            {/* LLM item with dropdown submenu */}
            <Headless.Menu as="div" className="relative">
                <Headless.Menu.Button className="text-sm font-medium flex items-center px-4">
                    LLM
                </Headless.Menu.Button>
                <Headless.Menu.Items className="absolute mt-2 bg-white shadow-lg rounded-md z-10">
                    <Headless.Menu.Item>
                        {({ active }) => (
                            <Link
                                href="/llm/vercel/ai-sdk/openai"
                                className={clsx(
                                    "block px-4 py-2",
                                    active ? "bg-blue-500 text-white" : "text-black"
                                )}
                            >
                                ChatGPT (Vercel SDK)
                            </Link>
                        )}
                    </Headless.Menu.Item>
                    <Headless.Menu.Item>
                        {({ active }) => (
                            <Link
                                href="/llm/grok"
                                className={clsx(
                                    "block px-4 py-2",
                                    active ? "bg-blue-500 text-white" : "text-black"
                                )}
                            >
                                Grok
                            </Link>
                        )}
                    </Headless.Menu.Item>
                </Headless.Menu.Items>
            </Headless.Menu>

            {/* Remaining Navbar items */}
            <NavbarLinkItem href="/diffusion">Diffusion</NavbarLinkItem>
            <NavbarLinkItem href="/tinker">Tinker</NavbarLinkItem>
            <NavbarLinkItem href="/references">References</NavbarLinkItem>
            <NavbarLinkItem href="/settings">Settings</NavbarLinkItem>
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
                className,
                "flex items-center gap-2 text-sm font-medium transition",
                // Dark mode styles
                "dark:text-white dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white"
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

export function NavbarLabel({
                                className,
                                ...props
                            }: React.ComponentPropsWithoutRef<"span">) {
    return <span {...props} className={clsx(className, "truncate")} />;
}
