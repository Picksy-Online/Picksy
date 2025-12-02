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
    Inbox,
    Send,
    Archive,
    AlertCircle,
    Settings,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

const navItems = [
    { href: "/messages", icon: Inbox, label: "Inbox" },
    { href: "/messages/sent", icon: Send, label: "Sent" },
    { href: "/messages/archived", icon: Archive, label: "Archived" },
    { href: "/messages/alerts", icon: AlertCircle, label: "Alerts" },
    { href: "/messages/settings", icon: Settings, label: "Settings" },
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
                            isActive={pathname === item.href || (item.href === "/messages" && pathname === "/messages")}
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

export function MessagesSidebar() {
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
