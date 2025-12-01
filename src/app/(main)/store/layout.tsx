'use client';
import { StoreSidebar } from "@/components/layout/store-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <StoreSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
