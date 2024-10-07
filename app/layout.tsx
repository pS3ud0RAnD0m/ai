import "@/app/_app.tsx";
import { Sidebar } from "@/app/components/ui/sidebar";
import { Navbar } from "@/app/components/ui/navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="en">
      <body className="flex h-screen overflow-hidden m-0 p-0">
      <Sidebar /> {/* Sidebar Component */}
      <div className="flex flex-col flex-1 h-full">
        <Navbar /> {/* Navbar Component */}
        <main className="p-4 overflow-y-auto flex-1">{children}</main>
      </div>
      </body>
      </html>
  );
}
