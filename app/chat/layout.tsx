import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: LayoutProps) {
  return (
      <div className="flex flex-col h-screen overflow-hidden m-0 p-0">
          {children}
      </div>
  );
}
