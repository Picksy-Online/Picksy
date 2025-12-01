'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { User, Package, Heart, Settings, LogOut, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';

export function ProfileSidebar() {
    const pathname = usePathname();

    const items = [
        {
            title: "My Profile",
            url: "/profile",
            icon: User,
        },
        {
            title: "My Orders",
            url: "/profile/orders",
            icon: Package,
        },
        {
            title: "Wishlist",
            url: "/profile/wishlist",
            icon: Heart,
        },
        {
            title: "Payment Methods",
            url: "/profile/payments",
            icon: CreditCard,
        },
        {
            title: "Settings",
            url: "/profile/settings",
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-16 border-b flex items-center justify-center">
                <Logo src="/picksy-logo-sidebar.png" className="w-auto h-12" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
