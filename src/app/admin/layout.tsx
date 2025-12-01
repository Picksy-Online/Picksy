
'use client';

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Header } from "@/components/layout/header";

function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (user.email !== '1@1.com') {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex items-center justify-center flex-1">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You do not have permission to access this page.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <SidebarProvider>
            <div className="flex flex-1">
                <AdminSidebar />
                <SidebarInset>
                    <div className="p-4 lg:p-8">{children}</div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    </div>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
  )
}
