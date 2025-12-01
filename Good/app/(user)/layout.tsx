
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/hooks/use-auth";

export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="py-6 text-center border-t text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Picksy. All rights reserved.</p>
        </footer>
      </div>
    </AuthProvider>
  );
}
