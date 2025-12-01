'use client';
import { CollectableCoinsSidebar } from "@/components/layout/collectable-coins-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function CollectableCoinsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <CollectableCoinsSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
