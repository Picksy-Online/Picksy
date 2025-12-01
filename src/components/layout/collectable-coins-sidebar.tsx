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
    useSidebar,
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
} from "lucide-react";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/collectable-coins/latest", icon: Sparkles, label: "Latest Coins" },
    { href: "/collectable-coins", icon: Search, label: "Browse" },
    { href: "/collectable-coins/favorites", icon: Heart, label: "Favorite Coins" },
    { href: "/collectable-coins/auctions", icon: Gavel, label: "Coin Auctions" },
    { href: "/collectable-coins/offers", icon: Tag, label: "Offers" },
    { href: "/collectable-coins/watchlist", icon: Eye, label: "My Watchlist" },
    { href: "/viewed", icon: Eye, label: "Recently Viewed" },
    { href: "/collectable-coins/following", icon: Users, label: "Following" },
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
                            isActive={pathname === item.href}
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

import { Logo } from "@/components/logo";

export function CollectableCoinsSidebar() {
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
            <SidebarContent className="p-2">
                <SidebarNavigation />
            </SidebarContent>
        </Sidebar>
    );
}
