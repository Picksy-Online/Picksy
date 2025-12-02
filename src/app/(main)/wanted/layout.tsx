'use client';
import { WantedSidebar } from "@/components/layout/wanted-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function WantedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <WantedSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
