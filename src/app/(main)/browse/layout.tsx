'use client';
import { BrowseSidebar } from "@/components/layout/browse-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <BrowseSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
