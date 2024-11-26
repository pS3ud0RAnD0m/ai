"use client";

import { useState } from "react";
import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import React, { forwardRef, useId } from "react";
import { TouchTarget } from "./button";
import { Link } from "./link";

export function Navbar({
                           className,
                           ...props
                       }: React.ComponentPropsWithoutRef<"nav">) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav
            {...props}
            className={clsx(
                className,
                "flex items-center justify-start gap-4 py-0 px-4",
            )}
        >
            {/* Original Navbar items */}
            <NavbarItem href="/" current={true}>Home</NavbarItem>

            {/* LLM item with dropdown submenu */}
            <Headless.Menu as="div" className="relative">
                <Headless.Menu.Button as={NavbarItem} href="/llm">
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
            <NavbarItem href="/diffusion">Diffusion</NavbarItem>
            <NavbarItem href="/tinker">Tinker</NavbarItem>
            <NavbarItem href="/references">References</NavbarItem>
            <NavbarItem href="/settings">Settings</NavbarItem>
        </nav>
    );
}

export function NavbarDivider({
                                  className,
                                  ...props
                              }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            aria-hidden="true"
            {...props}
            className={clsx(className, "h-6 w-px bg-zinc-950/10 dark:bg-white/10")}
        />
    );
}

export const NavbarItem = forwardRef<
    HTMLSpanElement,
    React.PropsWithChildren<
        { current?: boolean } & Omit<React.ComponentPropsWithoutRef<typeof Link>, "ref">
    >
>(({ current = false, className, children, ...props }, ref) => {
    const classes = clsx(
        className,
        "flex items-center gap-2 text-sm font-medium transition",
        "data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5",
        // Trailing icon (down chevron or similar)
        "data-[slot=icon]:last:[&:not(:nth-child(2))]:*:ml-auto data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-5 sm:data-[slot=icon]:last:[&:not(:nth-child(2))]:*:size-4",
        // Avatar
        "data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--avatar-radius:theme(borderRadius.DEFAULT)] data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6",
        // Hover
        "data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950",
        // Active
        "data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950",
        // Dark mode
        "dark:text-white dark:data-[slot=icon]:*:fill-zinc-400",
        "dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white",
        "dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white",
    );

    return (
        <span ref={ref} className={clsx(className, "relative")}>
      {current && (
          <motion.span
              layoutId="current-indicator"
              className="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-zinc-950 dark:bg-white"
          />
      )}
            {"href" in props ? (
                <Link
                    {...props}
                    className={classes}
                    data-current={current ? "true" : undefined}
                >
                    <TouchTarget>{children}</TouchTarget>
                </Link>
            ) : (
                <Headless.Button
                    {...props}
                    className={clsx("cursor-default", classes)}
                    data-current={current ? "true" : undefined}
                >
                    <TouchTarget>{children}</TouchTarget>
                </Headless.Button>
            )}
    </span>
    );
});

export function NavbarLabel({
                                className,
                                ...props
                            }: React.ComponentPropsWithoutRef<"span">) {
    return <span {...props} className={clsx(className, "truncate")} />;
}
