
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
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Box,
  Shapes,
  MessageSquareWarning,
  BarChart,
  ShieldCheck,
  User,
  ShieldAlert,
  Home,
  Palette,
} from "lucide-react";
import { Logo } from "@/components/logo";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Box, label: "Products" },
  { href: "/admin/categories", icon: Shapes, label: "Categories" },
  { href: "/admin/disputes", icon: MessageSquareWarning, label: "Disputes" },
  { href: "/admin/analytics", icon: BarChart, label: "Analytics" },
  { href: "/admin/moderation", icon: ShieldCheck, label: "Moderation" },
  { href: "/admin/fraud-detection", icon: ShieldAlert, label: "Fraud Detection" },
  { href: "/admin/site-content", icon: Palette, label: "Site Content" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="h-24 border-b flex items-center justify-start pt-5 pl-[30px]">
        <Logo src="/picksy-logo-sidebar.png" className="w-auto h-12" />
      </SidebarHeader>
      <SidebarContent className="p-2 pt-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View Site">
              <Link href="/">
                <Home />
                <span>View Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Your Profile">
              <Link href="/profile">
                <User />
                <span>Your Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
