'use client';

import { ProfileSidebar } from "@/components/layout/profile-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
                <ProfileSidebar />
                <SidebarInset>
                    <div className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
