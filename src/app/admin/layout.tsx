import { redirect } from 'next/navigation';
import { syncUser } from '@/actions/sync-user';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await syncUser();
  // const user = { role: 'ADMIN' }; // Mock for build

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6 py-4">
        <h1 className="text-2xl font-bold">Superadmin Dashboard</h1>
      </header>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
