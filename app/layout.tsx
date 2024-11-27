import "@/app/_app.tsx";
import { Navbar } from "@/app/components/ui/navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className="flex flex-col h-screen m-0 p-0">
        <Navbar /> {/* Navbar Component */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
        </body>
        </html>
    );
}
