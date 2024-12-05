"use client";

import { ReactNode } from "react";
import { SidebarLayout } from "@/app/components/ui/prompt/sidebar-layout";

interface LayoutProps {
    children: ReactNode;
}

export default function TransformersLayout({ children }: LayoutProps) {
    return (
        <SidebarLayout>
            {children}
        </SidebarLayout>
    );
}
