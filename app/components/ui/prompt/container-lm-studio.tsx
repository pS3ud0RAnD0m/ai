"use client";

import React, { useRef, useState } from "react";
import { useChat, Message } from "ai/react";
import axios from "axios";

const ContainerLmStudio: React.FC = () => {
    const { messages, input, handleInputChange, setMessages, setInput } = useChat();
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref for input field

    const apiBaseUrl = `${process.env.NEXT_PUBLIC_LM_STUDIO_API_BASE_URL}/v1/chat/completions`;
    const defaultModel = `${process.env.NEXT_PUBLIC_LM_STUDIO_API_DEFAULT_MODEL}`;

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;

        // Add the user's message to the chat
        const newUserMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: userMessage,
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setInput(""); // Clear the input field
        setIsLoading(true);

        try {
            // Send the request to LM Studio
            const response = await axios.post(apiBaseUrl, {
                model: defaultModel,
                messages: [...messages, newUserMessage].map(({ role, content }) => ({
                    role,
                    content,
                })),
                stream: false,
            });

            // Extract the assistant's response from the API response
            const assistantContent = response.data?.choices?.[0]?.message?.content;
            if (assistantContent) {
                const newAssistantMessage: Message = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: assistantContent.replace(/<\/s>$/, ""), // Remove any trailing '</s>'
                };
                setMessages((prev) => [...prev, newAssistantMessage]);
            }
        } catch (error) {
            console.error(
                "Error communicating with LM Studio API:",
                error instanceof Error ? error.message : String(error)
            );
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
            inputRef.current?.focus(); // Focus on input field after sending
        }
    };

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto mt-10 bg-black text-gray-200">
            {/* Model Header */}
            <div className="text-red-500 text-center py-2 text-base font-medium bg-black">
                Model: {defaultModel}
            </div>

            {/* Messages Section */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-black">
                {messages.map(({ id, role, content }) => (
                    <div key={id} className="flex items-center space-x-2">
                        {/* Avatar */}
                        <img
                            src={
                                role === "user"
                                    ? "/assets/images/avatars/avatar-pr.png"
                                    : "/assets/images/avatars/avatar-ai.png"
                            }
                            alt={role === "user" ? "User Avatar" : "Assistant Avatar"}
                            className="w-6 h-6"
                        />
                        {/* Message */}
                        <div
                            className={`py-2 px-3 text-base ${
                                role === "user"
                                    ? "bg-red-700 text-white"
                                    : "bg-black text-gray-200"
                            } flex-grow`}
                        >
                            {content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Section */}
            <form
                onSubmit={handleCustomSubmit}
                className="flex items-center p-3 bg-black"
            >
                <input
                    type="text"
                    ref={inputRef} // Ref for focusing input field
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 bg-black text-white placeholder-gray-500 border-none px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:bg-gray-600"
                >
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
};

export default ContainerLmStudio;
