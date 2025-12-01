
'use client';
import { CollectorCardsSidebar } from "@/components/layout/collector-cards-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function CollectorCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <CollectorCardsSidebar />
        <SidebarInset>
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
