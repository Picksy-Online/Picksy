
import { Header } from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <footer className="py-6 text-center border-t text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Picksy. All rights reserved.</p>
      </footer>
    </div>
  );
}
