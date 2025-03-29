"use client";

import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const PROVIDERS: Record<string, string | undefined> = {
  "Local: LM Studio": process.env.NEXT_PUBLIC_LM_STUDIO_API_BASE_URL,
  OpenAI: process.env.NEXT_PUBLIC_OPENAI_API_BASE_URL,
  xAI: process.env.NEXT_PUBLIC_XAI_API_BASE_URL,
};

export function Sidebar({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav {...props} className={clsx(className, "flex h-full min-h-0 flex-col")}>
      <SidebarHeader />
      <SidebarBody />
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="relative border-b border-gray-300 p-4 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-400">Configuration</h2>
    </div>
  );
}

function SidebarBody() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
      <ProviderDropdown />
    </div>
  );
}

function ProviderDropdown() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [chatOption, setChatOption] = useState<"new" | "old" | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const fetchModels = useCallback(async () => {
    if (!selectedProvider) return;

    try {
      let modelNames: string[] = [];

      if (selectedProvider === "OpenAI") {
        const response = await openai.models.list();
        modelNames = response.data.map((model) => model.id);
      } else {
        const apiBaseUrl = PROVIDERS[selectedProvider];
        if (!apiBaseUrl) return;
        const response = await fetch(`${apiBaseUrl}/v1/models`);
        const data = await response.json();
        modelNames = data?.data?.map((model: { id: string }) => model.id) || [];
      }

      setModels(modelNames);
      setConnected(true);
      setTimeout(() => setConnected(false), 1000);
    } catch (error) {
      console.error(`Error fetching models for ${selectedProvider}:`, error);
      setModels([]);
    }
  }, [selectedProvider]);

  const fetchChatHistory = useCallback(async () => {
    if (!selectedProvider) return;

    try {
      let chats: string[] = [];

      if (selectedProvider === "OpenAI") {
        // OpenAI does NOT provide an API to list all threads
        chats = ["OpenAI does not support fetching past conversations."];
      } else {
        const apiBaseUrl = PROVIDERS[selectedProvider];
        if (!apiBaseUrl) return;
        const response = await fetch(`${apiBaseUrl}/v1/chats`);
        const data = await response.json();
        chats =
          data?.data?.map((chat: { id: string; name: string }) => chat.name) ||
          [];
      }

      setChatHistory(chats.length > 0 ? chats : ["No previous chats found."]);
    } catch (error) {
      console.error("Error fetching OpenAI chat history:", error);
      setChatHistory(["No previous chats found."]);
    }
  }, [selectedProvider]);

  useEffect(() => {
    if (selectedProvider) {
      fetchModels();
    }
  }, [selectedProvider, fetchModels]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400">
        Provider
      </label>
      <Headless.Listbox value={selectedProvider} onChange={setSelectedProvider}>
        <Headless.Listbox.Button className="w-full rounded-md border border-gray-500 text-gray-400 bg-black py-2 px-3 text-left shadow-xs">
          {selectedProvider || "Select provider"}
        </Headless.Listbox.Button>
        <Headless.Listbox.Options className="absolute z-10 mt-1 w-full rounded-md text-gray-400 bg-black shadow-lg">
          {Object.keys(PROVIDERS).map((provider) => (
            <Headless.Listbox.Option
              key={provider}
              value={provider}
              className={({ active }) =>
                clsx(
                  "cursor-pointer select-none px-4 py-2",
                  active ? "bg-green-900 text-gray-400" : "text-gray-400",
                )
              }
            >
              {provider}
            </Headless.Listbox.Option>
          ))}
        </Headless.Listbox.Options>
      </Headless.Listbox>

      {connected && <p className="text-green-400 mt-1 text-sm">Connected!</p>}

      <div className="mt-4">
        {chatOption === null ? (
          <>
            <button
              onClick={() => setChatOption("new")}
              className="w-full text-left px-3 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
            >
              New Chat
            </button>
            <button
              onClick={() => {
                setChatOption("old");
                fetchChatHistory();
              }}
              className="w-full text-left mt-2 px-3 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
            >
              Old Chat
            </button>
          </>
        ) : chatOption === "new" ? (
          <ModelDropdown models={models} onBack={() => setChatOption(null)} />
        ) : (
          <ChatHistoryDropdown
            chatHistory={chatHistory}
            onBack={() => setChatOption(null)}
          />
        )}
      </div>
    </div>
  );
}

function ModelDropdown({
  models,
  onBack,
}: {
  models: string[];
  onBack: () => void;
}) {
  return (
    <div>
      <button onClick={onBack} className="text-gray-400 text-sm underline mb-2">
        Back
      </button>
      <label className="block text-sm font-medium text-gray-400">
        Select Model
      </label>
      <Headless.Listbox>
        <Headless.Listbox.Button className="w-full rounded-md border border-gray-500 text-gray-400 bg-black py-2 px-3 text-left shadow-xs">
          Choose a model
        </Headless.Listbox.Button>
        <Headless.Listbox.Options className="absolute z-10 mt-1 w-full rounded-md text-gray-400 bg-black shadow-lg">
          {models.map((model) => (
            <Headless.Listbox.Option
              key={model}
              value={model}
              className="cursor-pointer select-none px-4 py-2"
            >
              {model}
            </Headless.Listbox.Option>
          ))}
        </Headless.Listbox.Options>
      </Headless.Listbox>
    </div>
  );
}

function ChatHistoryDropdown({
  chatHistory,
  onBack,
}: {
  chatHistory: string[];
  onBack: () => void;
}) {
  return (
    <div>
      <button onClick={onBack} className="text-gray-400 text-sm underline mb-2">
        Back
      </button>
      <label className="block text-sm font-medium text-gray-400">
        Select Previous Chat
      </label>
      <ul className="bg-gray-800 rounded-md p-2">
        {chatHistory.map((chat, index) => (
          <li key={index} className="py-1 text-gray-300">
            {chat}
          </li>
        ))}
      </ul>
    </div>
  );
}
