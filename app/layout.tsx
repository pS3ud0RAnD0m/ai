// app/layout.tsx
import "@/app/globals.css";
import { Sidebar } from "@/app/components/ui/sidebar";
import { Navbar } from "@/app/components/ui/navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4">{children}</main>
          <footer className="p-4 bg-gray-800 text-center">
            © 2024 AI Chat App
          </footer>
        </div>
      </body>
    </html>
  );
}
