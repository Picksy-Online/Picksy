
'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
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
      <div className="container flex min-h-screen">
        <div className="hidden lg:block">
            {getSidebar()}
        </div>
        <div className="flex-1 lg:pl-8">{children}</div>
      </div>
    </SidebarProvider>
  );
}
