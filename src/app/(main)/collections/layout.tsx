'use client';
import { CollectionsSidebar } from "@/components/layout/collections-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function CollectionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <CollectionsSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
