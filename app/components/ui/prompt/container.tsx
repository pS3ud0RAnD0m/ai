"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat, Message } from "ai/react";
import axios from "axios";
import Image from "next/image";
import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";

const Container: React.FC = () => {
  const { messages, input, handleInputChange, setMessages, setInput } =
    useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false); // For flash effect on click
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const apiBaseUrl = `${process.env.NEXT_PUBLIC_LM_STUDIO_API_BASE_URL}/v1/chat/completions`;
  const currentModel = `${process.env.NEXT_PUBLIC_LM_STUDIO_API_CURRENT_MODEL}`;
  const currentProvider = "LM Studio";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [input, isLoading]);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage) return;

    setClicked(true);
    setTimeout(() => setClicked(false), 200);

    const newUserMessage: Message = {
      id: uuidv4(), // Replace crypto.randomUUID() with uuidv4()
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Reset the textarea height to default (1 row)
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

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
          id: uuidv4(), // Replace crypto.randomUUID() with uuidv4()
          role: "assistant",
          content: assistantContent.replace(/<\/s>$/, ""),
        };
        setMessages((prev) => [...prev, newAssistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(), // Replace crypto.randomUUID() with uuidv4()
        role: "system",
        content: `Error: Unable to process your request. ${
          error instanceof Error ? error.message : ""
        }`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const autoExpand = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"; // Reset height to calculate the new size
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Adjust height based on content
    }
  };

  return (
    <div className="flex flex-col w-full mx-auto mt-10 bg-black text-gray-200">
      <div className="flex-1 p-0 m-0 bg-black">
        {messages.map(({ id, role, content }) => (
          <div
            key={id}
            className="flex items-start space-x-2 mb-3" // Flex container for avatar and message
          >
            <Image
              src={
                role === "user"
                  ? "/assets/images/avatars/avatar-pr.png"
                  : "/assets/images/avatars/avatar-assistant.png"
              }
              alt={role === "user" ? "User Avatar" : "Assistant Avatar"}
              width={24}
              height={24}
              className="w-6 h-6 mt-[2px]" // Slight margin-top adjustment for alignment
            />
            <div
              className={`py-2 px-3 text-base ${
                role === "user"
                  ? "bg-red-700 text-white"
                  : "bg-black text-gray-200"
              } flex-grow leading-relaxed`} // Line height adjustment for alignment
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content.replace(/\n/g, "<br />")),
              }}
            ></div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleCustomSubmit}
        className="flex items-center space-x-2 p-3 bg-black"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            handleInputChange(e);
            autoExpand();
          }}
          className="flex-1 bg-black text-white placeholder-gray-500 border-2 border-metallic shadow-polished rounded-md px-4 py-2 focus:ring-1 focus:border-green-500 outline-none resize-none"
          rows={1} // Start with a single row
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent newline on Enter
              handleCustomSubmit(e); // Submit the message
            }
          }}
          tabIndex={0} // Ensure textarea is focusable
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`px-4 py-2 bg-red-600 text-white rounded-md ${
            !isLoading
              ? "hover:ring-1 focus:ring-1 hover:ring-green-500 focus:ring-green-500"
              : ""
          } disabled:bg-gray-600 ${clicked ? "bg-green-500" : ""}`}
          tabIndex={0}
        >
          {isLoading ? "Processing ..." : "Send"}
        </button>
      </form>
      <div className="p-2 text-sm text-gray-500 text-center">
        <pre>
          {currentProvider} | {apiBaseUrl} | {currentModel}
        </pre>
      </div>
    </div>
  );
};

export default Container;
