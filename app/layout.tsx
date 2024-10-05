import "@/app/globals.css";
import { Sidebar } from "@/app/components/ui/sidebar";
import { Navbar } from "@/app/components/ui/navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <body className="flex h-screen">
      <Sidebar /> {/* Sidebar Component */}
      <div className="flex flex-col flex-1">
        <Navbar /> {/* Navbar Component */}
        <main className="p-4 overflow-y-auto flex-1">{children}</main> {/* Main content area */}
      </div>
      </body>
      </html>
  );
}
