"use client";

import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const PROVIDERS: Record<string, string | undefined> = {
    "Local: LM Studio": process.env.NEXT_PUBLIC_LM_STUDIO_API_BASE_URL,
    "OpenAI": process.env.NEXT_PUBLIC_OPENAI_API_BASE_URL,
};

export function Sidebar({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
    return (
        <nav {...props} className={clsx(className, "flex h-full min-h-0 flex-col")}>
            <SidebarHeader />
            <SidebarBody />
        </nav>
    );
}

// Provider selection dropdown
function ProviderDropdown() {
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [models, setModels] = useState<string[]>([]);
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    const fetchModels = useCallback(async (apiBaseUrl: string) => {
        try {
            const headers: Record<string, string> = {};
            if (selectedProvider === "OpenAI" && OPENAI_API_KEY) {
                headers["Authorization"] = `Bearer ${OPENAI_API_KEY}`;
            }

            const response = await axios.get(`${apiBaseUrl}/v1/models`, { headers });
            const modelNames = response.data?.data?.map((model: { id: string }) => model.id) || [];
            setModels(modelNames);
        } catch (error) {
            console.error("Error fetching models:", error);
            setModels([]);
        }
    }, [selectedProvider, OPENAI_API_KEY]);

    useEffect(() => {
        if (selectedProvider && PROVIDERS[selectedProvider]) {
            fetchModels(PROVIDERS[selectedProvider] as string);
        }
    }, [selectedProvider, fetchModels]);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">Provider</label>
            <Headless.Listbox value={selectedProvider} onChange={setSelectedProvider}>
                <Headless.Listbox.Button className="w-full rounded-md border border-gray-500 text-gray-400 bg-black py-2 px-3 text-left shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
                    {selectedProvider || "Select provider"}
                </Headless.Listbox.Button>
                <Headless.Listbox.Options className="absolute z-10 mt-1 w-full rounded-md text-gray-400 bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {Object.keys(PROVIDERS).map((provider) => (
                        <Headless.Listbox.Option
                            key={provider}
                            value={provider}
                            className={({ active }) =>
                                clsx("cursor-pointer select-none px-4 py-2", active ? "bg-green-900 text-gray-400" : "text-gray-400")
                            }
                        >
                            {provider}
                        </Headless.Listbox.Option>
                    ))}
                </Headless.Listbox.Options>
            </Headless.Listbox>

            {/* Display fetched models */}
            {models.length > 0 && (
                <div className="mt-2 p-2 bg-gray-800 rounded-md">
                    <label className="block text-sm font-medium text-gray-400">Available Models</label>
                    <ul className="text-gray-300 text-sm mt-1">
                        {models.map((model) => (
                            <li key={model} className="py-1">{model}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// Sidebar header
function SidebarHeader() {
    return (
        <div className="relative border-b border-gray-300 p-4 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-400">Configuration</h2>
        </div>
    );
}

// Sidebar body
function SidebarBody() {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
            <ProviderDropdown />
        </div>
    );
}
