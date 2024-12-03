"use client";

import * as Headless from "@headlessui/react";
import clsx from "clsx";

export function Sidebar({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
    return (
        <nav {...props} className={clsx(className, "flex h-full min-h-0 flex-col")}>
            <SidebarHeader />
            <SidebarBody>
                <ProviderDropdown />
                <ModelDropdown />
                <StoreConversationCheckbox />
            </SidebarBody>
        </nav>
    );
}

// Dropdown for selecting the provider
function ProviderDropdown() {
    const providers = ["Local: LM Studio", "OpenAI", "Anthropic", "X"];
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-black dark:text-gray-300">
                Provider
            </label>
            <Headless.Listbox>
                <Headless.Listbox.Button className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm dark:bg-black dark:border-gray-700 dark:text-gray-300">
                    Select provider
                </Headless.Listbox.Button>
                <Headless.Listbox.Options className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-black dark:text-gray-300">
                    {providers.map((provider) => (
                        <Headless.Listbox.Option
                            key={provider}
                            value={provider}
                            className={({ active }) =>
                                clsx(
                                    "cursor-pointer select-none px-4 py-2",
                                    active ? "bg-green-900 text-white" : "text-black dark:text-gray-300"
                                )
                            }
                        >
                            {provider}
                        </Headless.Listbox.Option>
                    ))}
                </Headless.Listbox.Options>
            </Headless.Listbox>
        </div>
    );
}

// Dropdown for selecting the model
function ModelDropdown() {
    const models = ["ChatGPT 4", "ChatGPT 4o", "Grok"];
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Model
            </label>
            <Headless.Listbox>
                <Headless.Listbox.Button className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-left shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm dark:bg-black dark:border-gray-700 dark:text-gray-300">
                    Select model
                </Headless.Listbox.Button>
                <Headless.Listbox.Options className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-black dark:text-gray-300">
                    {models.map((model) => (
                        <Headless.Listbox.Option
                            key={model}
                            value={model}
                            className={({ active }) =>
                                clsx(
                                    "cursor-pointer select-none px-4 py-2",
                                    active ? "bg-green-900 text-white" : "text-black dark:text-gray-300"
                                )
                            }
                        >
                            {model}
                        </Headless.Listbox.Option>
                    ))}
                </Headless.Listbox.Options>
            </Headless.Listbox>
        </div>
    );
}

// Checkbox for storing conversations
function StoreConversationCheckbox() {
    return (
        <div className="flex items-center">
            <input
                id="store-conversation"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-green-900 focus:ring-green-900 dark:bg-gray-900 dark:border-gray-700"
            />
            <label
                htmlFor="store-conversation"
                className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                Store conversation
            </label>
        </div>
    );
}

// Header and body for the sidebar
function SidebarHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            {...props}
            className={clsx(
                className,
                "relative border-b border-gray-300 p-4 dark:border-gray-700"
            )}
        >
            <h2 className="text-lg font-bold">LLM Config</h2>
        </div>
    );
}

export function SidebarBody({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div {...props} className={clsx(className, "flex flex-1 flex-col p-4 space-y-4")} />
    );
}
