
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

const navItems = [
  { href: "/collector-cards", icon: Home, label: "Card Home" },
  { href: "/collector-cards/latest", icon: Sparkles, label: "Latest Cards" },
  { href: "/collector-cards/auctions", icon: Gavel, label: "Card Auctions" },
  { href: "/collector-cards/watchlist", icon: Eye, label: "My Watchlist" },
  { href: "/viewed", icon: Eye, label: "Recently Viewed" },
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
                  <Link href={item.href} passHref>
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

import { Logo } from "@/components/logo";

export function CollectorCardsSidebar() {
  const { setOpen } = useSidebar();

  return (
    <Sidebar
      className="hidden lg:flex"
      variant="inset"
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarHeader className="h-16 border-b flex items-center justify-center">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2 pt-10">
        <SidebarNavigation />
      </SidebarContent>
    </Sidebar>
  );
}
