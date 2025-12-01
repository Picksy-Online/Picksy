'use client';
import { CollectiblesSidebar } from "@/components/layout/collectibles-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function CollectiblesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <CollectiblesSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
