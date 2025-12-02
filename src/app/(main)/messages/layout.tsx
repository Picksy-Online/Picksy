'use client';
import { MessagesSidebar } from "@/components/layout/messages-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <MessagesSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
