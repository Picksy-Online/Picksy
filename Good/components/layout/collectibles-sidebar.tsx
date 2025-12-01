
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
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
import { Logo } from "../logo";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/collectibles/latest", icon: Sparkles, label: "Latest Collectibles" },
  { href: "/collectibles", icon: Search, label: "Browse" },
  { href: "/collectibles/favorites", icon: Heart, label: "Favorite Categories" },
  { href: "/auctions", icon: Gavel, label: "Auctions" },
  { href: "/collectibles/wanted", icon: FileSearch, label: "Wanted" },
  { href: "/collectibles/offers", icon: Tag, label: "Offers" },
  { href: "/collectibles/watchlist", icon: Eye, label: "My Watchlist" },
  { href: "/collectibles/following", icon: Users, label: "Following" },
];

function SidebarNavigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  
  const handleLinkClick = () => {
    if (setOpenMobile) {
      setOpenMobile(false);
    }
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
  return (
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center justify-between">
                <Link href="/" className="inline-block group-data-[state=collapsed]:hidden">
                    <Logo className="w-auto h-7" />
                </Link>
                <SidebarTrigger />
            </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <SidebarNavigation />
        </SidebarContent>
      </Sidebar>
  );
}
