
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Sparkles,
  Search,
  Heart,
  Gavel,
  FileSearch,
  Tag,
  Eye,
  Users,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/collectibles/latest", icon: Sparkles, label: "Latest Collectibles" },
  { href: "/collectibles", icon: Search, label: "Browse" },
  { href: "/collectibles/favorites", icon: Heart, label: "Favorite Categories" },
  { href: "/auctions", icon: Gavel, label: "Auctions" },
  { href: "/collectibles/wanted", icon: FileSearch, label: "Wanted" },
  { href: "/collectibles/offers", icon: Tag, label: "Offers" },
  { href: "/collectibles/watchlist", icon: Eye, label: "My Watchlist" },
  { href: "/viewed", icon: Eye, label: "Recently Viewed" },
  { href: "/collectibles/following", icon: Users, label: "Following" },
];

function SidebarNavigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} onClick={handleLinkClick}>
            <SidebarMenuButton
              isActive={pathname === item.href && item.href !== '/'}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function CollectiblesSidebar() {
  const { setOpen } = useSidebar();

  return (
    <Sidebar
      className="hidden lg:flex"
      variant="inset"
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarContent className="p-2">
        <SidebarNavigation />
      </SidebarContent>
    </Sidebar>
  );
}
