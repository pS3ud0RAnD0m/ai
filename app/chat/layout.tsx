// app/chat/layout.tsx
import { Sidebar } from "@/app/components/ui/sidebar";
import { Navbar } from "@/app/components/ui/navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
