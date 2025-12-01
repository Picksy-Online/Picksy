'use client';
import { SellersSidebar } from "@/components/layout/sellers-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function SellersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={false}>
            <SellersSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
