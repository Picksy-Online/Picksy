"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
    Home,
    PlusCircle,
    List,
    Search,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

const navItems = [
    { href: "/wanted", icon: Home, label: "Wanted Home" },
    { href: "/dashboard/wanted/create", icon: PlusCircle, label: "Post Wanted Item" },
    // Placeholder links for future features to match the "richness" of the other sidebar
    { href: "/wanted/my-items", icon: List, label: "My Wanted Items" },
    { href: "/wanted/search", icon: Search, label: "Search Wanted" },
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
        </SidebarMenu>
    );
}

export function WantedSidebar() {
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
