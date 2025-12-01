
'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, ShoppingBag, BarChart, Tag, Truck, MessageCircleWarning, Users, Bookmark, Settings, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../logo';
import { usePathname } from 'next/navigation';

const menuItems = [
    { href: '/dashboard/sales', label: 'Sales', icon: ShoppingBag },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart },
    { href: '/dashboard/promotions', label: 'Cross-Post', icon: Tag },
    { href: '/dashboard/orders', label: 'Orders', icon: Truck },
    { href: '/dashboard/disputes', label: 'Disputes', icon: MessageCircleWarning },
    { href: '/dashboard/friends', label: 'Friends', icon: UserPlus },
    { href: '/dashboard/groups', label: 'Groups', icon: Users },
    { href: '/dashboard/collections', label: 'Collections', icon: Bookmark },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center justify-between">
                    <Link href="/" className="inline-block">
                        <Logo className="w-auto h-7" />
                    </Link>
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent className='p-2'>
                <SidebarMenu>
                    {menuItems.map(item => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton tooltip={item.label} isActive={pathname === item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
