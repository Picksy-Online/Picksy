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
    Search,
    Eye,
    Sparkles,
    Heart,
    Gavel,
    Tag,
    Users,
} from "lucide-react";
import { Logo } from "@/components/logo";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/browse", icon: Search, label: "Browse All" },
    { href: "/browse/latest", icon: Sparkles, label: "Latest Items" },
    { href: "/browse/favorites", icon: Heart, label: "Favorites" },
    { href: "/auctions", icon: Gavel, label: "Auctions" },
    { href: "/browse/offers", icon: Tag, label: "Offers" },
    { href: "/viewed", icon: Eye, label: "Recently Viewed" },
    { href: "/browse/following", icon: Users, label: "Following" },
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

export function CollectionsSidebar() {
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
                <Logo src="/picksy-logo-sidebar.png" className="w-auto h-12" />
            </SidebarHeader>
            <SidebarContent className="p-2 pt-10">
                <SidebarNavigation />
            </SidebarContent>
        </Sidebar>
    );
}
