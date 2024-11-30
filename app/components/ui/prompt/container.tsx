"use client";

import React, { useRef, useState } from "react";
import { useChat, Message } from "ai/react";
import axios from "axios";
import Image from "next/image";

const Container: React.FC = () => {
    const { messages, input, handleInputChange, setMessages, setInput } = useChat();
    const [isLoading, setIsLoading] = useState(false);
    const [clicked, setClicked] = useState(false); // For flash effect on click
    const inputRef = useRef<HTMLInputElement | null>(null);

    const apiBaseUrl = `${process.env.NEXT_PUBLIC_LM_STUDIO_API_BASE_URL}/v1/chat/completions`;
    const currentModel = `${process.env.NEXT_PUBLIC_LM_STUDIO_API_DEFAULT_MODEL}`;
    const currentProvider = "LM Studio";

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;

        setClicked(true); // Trigger flash effect
        setTimeout(() => setClicked(false), 200); // Reset flash after 200ms

        const newUserMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: userMessage,
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post(apiBaseUrl, {
                model: currentModel,
                messages: [...messages, newUserMessage].map(({ role, content }) => ({
                    role,
                    content,
                })),
                stream: false,
            });

            const assistantContent = response.data?.choices?.[0]?.message?.content;
            if (assistantContent) {
                const newAssistantMessage: Message = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: assistantContent.replace(/<\/s>$/, ""),
                };
                setMessages((prev) => [...prev, newAssistantMessage]);
            }
        } catch (error) {
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: "system",
                content: `Error: Unable to process your request. ${
                    error instanceof Error ? error.message : ""
                }`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col w-full mx-auto mt-10 bg-black text-gray-200">
            <div className="flex-1 p-0 m-0 bg-black">
                {messages.map(({ id, role, content }) => (
                    <div key={id} className="flex items-center space-x-2 mb-3">
                        <Image
                            src={
                                role === "user"
                                    ? "/assets/images/avatars/avatar-pr.png"
                                    : "/assets/images/avatars/avatar-ai.png"
                            }
                            alt={role === "user" ? "User Avatar" : "Assistant Avatar"}
                            width={24}
                            height={24}
                            className="w-6 h-6"
                        />
                        <div
                            className={`py-2 px-3 text-base ${
                                role === "user" ? "bg-red-700 text-white" : "bg-black text-gray-200"
                            } flex-grow`}
                        >
                            {content}
                        </div>
                    </div>
                ))}
            </div>
            <form
                onSubmit={handleCustomSubmit}
                className="flex items-center p-3 bg-black"
            >
                <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder=""
                    className="flex-1 bg-black text-white placeholder-gray-500 border-2 border-metallic shadow-polished rounded-md px-4 py-2 focus:ring-2 focus:border-green-500 outline-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:ring-2 hover:ring-green-500 disabled:bg-gray-600 ${
                        clicked ? "bg-green-500" : ""
                    }`}
                >
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </form>
            <div className="p-2 text-sm text-gray-500 text-center">
                <pre>
                    {currentProvider}     |     {apiBaseUrl}     |     {currentModel}
                </pre>
            </div>
        </div>
    );
};

export default Container;
