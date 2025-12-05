import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">User Management</h3>
            <p className="text-sm text-muted-foreground">Manage users and roles</p>
          </div>
        </div>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href="/admin/users">View Users</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
