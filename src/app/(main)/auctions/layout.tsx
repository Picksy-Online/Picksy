'use client';
import { AuctionsSidebar } from "@/components/layout/auctions-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AuctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AuctionsSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
