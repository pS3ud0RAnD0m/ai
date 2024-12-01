import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
        return NextResponse.json({ error: "File path is required." }, { status: 400 });
    }

    try {
        // Normalize slashes based on the operating system
        const normalizedPath = process.platform === "win32"
            ? filePath.replace(/\//g, "\\") // Convert forward slashes to backslashes on Windows
            : filePath;

        console.log("Normalized File Path:", normalizedPath); // Log for debugging

        const resolvedPath = path.resolve(normalizedPath);
        const content = await fs.readFile(resolvedPath, "utf-8");

        return new NextResponse(content, { status: 200 });
    } catch (error) {
        console.error("Error reading file:", error);
        return NextResponse.json({ error: "Unable to read file." }, { status: 500 });
    }
}
