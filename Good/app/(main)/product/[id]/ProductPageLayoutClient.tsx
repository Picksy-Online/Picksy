
'use client';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BrowseSidebar } from "@/components/layout/browse-sidebar";
import { CollectorCardsSidebar } from "@/components/layout/collector-cards-sidebar";
import { CollectiblesSidebar } from "@/components/layout/collectibles-sidebar";
import { Product } from "@/lib/types";

export default function ProductPageLayoutClient({
  children,
  product,
}: {
  children: React.ReactNode;
  product: Product | undefined;
}) {
  const isCollectorCard = product?.category === "Collector Cards";
  const isCollectible = product?.category === "Vintage";

  const getSidebar = () => {
    if (isCollectorCard) {
      return <CollectorCardsSidebar />;
    }
    if (isCollectible) {
      return <CollectiblesSidebar />;
    }
    return <BrowseSidebar />;
  };

  return (
    <SidebarProvider>
      <div className="hidden lg:block">
          {getSidebar()}
      </div>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
