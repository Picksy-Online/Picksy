
'use client';

import { useFirebase } from '@/firebase';
import { ProfileForm } from '@/components/profile-form';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading } = useFirebase();

  if (isUserLoading) {
    return (
      <div className="container flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-12">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
       <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline md:text-4xl">
          Your Profile
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and seller settings.
        </p>
      </div>
      <div className="mt-8">
        <ProfileForm currentUser={user} />
      </div>
    </div>
  );
}
