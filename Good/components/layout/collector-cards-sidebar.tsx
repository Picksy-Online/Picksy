
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Home,
    Sparkles,
    Search,
    Heart,
    Gavel,
    Tag,
    Eye,
    Users,
    Upload,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "../logo";

const navItems = [
  { href: "/collector-cards", icon: Home, label: "Card Home" },
  { href: "/collector-cards/latest", icon: Sparkles, label: "Latest Cards" },
  { href: "/collector-cards/auctions", icon: Gavel, label: "Card Auctions" },
  { href: "/collector-cards/watchlist", icon: Eye, label: "My Watchlist" },
  { href: "/collector-cards/offers", icon: Tag, label: "My Card Offers" },
  { href: "/collector-cards/favorites", icon: Heart, label: "Favorite Cards" },
  { href: "/collector-cards/following", icon: Users, label: "Following" },
  { href: "/sell-cards", icon: Upload, label: "Sell Your Cards" },
];

const cardSections = [
    { href: "/collector-cards/nba", label: "NBA" },
    { href: "/collector-cards/nfl", label: "NFL" },
    { href: "/collector-cards/soccer", label: "Soccer" },
    { href: "/collector-cards/wwe", label: "WWE" },
    { href: "/collector-cards/pokemon", label: "Pokemon" },
    { href: "/collector-cards/numbered-cards", label: "Numbered Cards" },
    { href: "/collector-cards/autographs", label: "Autographs" },
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
                      tooltip={item.label} 
                      isActive={pathname === item.href}
                  >
                      <item.icon />
                      <span>{item.label}</span>
                  </SidebarMenuButton>
              </Link>
           </SidebarMenuItem>
        ))}
        <Accordion.Root type="multiple" defaultValue={["item-1"]} className="w-full">
          <Accordion.Item value="item-1" className="border-none">
              <Accordion.Trigger asChild>
                  <SidebarMenuButton>
                      <Search />
                      <span>Card Sections</span>
                  </SidebarMenuButton>
              </Accordion.Trigger>
              <Accordion.Content>
                  <SidebarMenuSub>
                      {cardSections.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                              <Link href={item.href} passHref onClick={handleLinkClick}>
                                <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                                  <span>{item.label}</span>
                                </SidebarMenuSubButton>
                              </Link>
                          </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
              </Accordion.Content>
          </Accordion.Item>
      </Accordion.Root>
      </SidebarMenu>
  );
}

export function CollectorCardsSidebar() {
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
