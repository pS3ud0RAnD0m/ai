"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ReferencesPage: React.FC = () => {
    const [markdownContent, setMarkdownContent] = useState<string>("");

    const fetchMarkdown = async (): Promise<void> => {
        const filePath = process.env.NEXT_PUBLIC_REFERENCE_FILE;

        if (!filePath) {
            setMarkdownContent("# Error\nEnvironment variable is missing.");
            return;
        }

        try {
            // Replace backslashes with forward slashes
            const normalizedPath = filePath.replace(/\\/g, "/");

            const response: Response = await fetch(
                `/api/files?path=${encodeURIComponent(normalizedPath)}`
            );

            if (!response.ok) {
                setMarkdownContent(`# Error\nFailed to load the Markdown file.`);
                return;
            }

            const data = await response.text();
            setMarkdownContent(data);
        } catch (error) {
            console.error("Error loading Markdown file:", error);
            setMarkdownContent(`# Error\nAn unexpected error occurred.`);
        }
    };

    useEffect(() => {
        const loadMarkdown = async () => {
            await fetchMarkdown();
        };

        loadMarkdown().catch((error) => {
            console.error("Unhandled error in loadMarkdown:", error);
        });
    }, []);

    return (
        <div className="p-6 bg-black text-gray-200">
            <h1 className="text-2xl font-bold mb-4 text-red-600">References</h1>
            <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdownContent}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default ReferencesPage;
