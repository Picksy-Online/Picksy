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
    Gavel,
    TrendingUp,
    Clock,
    Trophy,
    Eye,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/auctions", icon: Gavel, label: "All Auctions" },
    { href: "/auctions/ending-soon", icon: Clock, label: "Ending Soon" },
    { href: "/auctions/popular", icon: TrendingUp, label: "Popular" },
    { href: "/auctions/won", icon: Trophy, label: "My Wins" },
    { href: "/viewed", icon: Eye, label: "Recently Viewed" },
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

export function AuctionsSidebar() {
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
