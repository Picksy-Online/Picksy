'use client';

import { useUser as useClerkUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { User as CustomUser } from '@/lib/types';
import { syncUser } from '@/actions/sync-user';

export const useAuth = () => {
    const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser();
    const [dbUser, setDbUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sync = async () => {
            if (isLoaded && isSignedIn && clerkUser) {
                try {
                    const user = await syncUser();
                    if (user) {
                        // Map Prisma user to CustomUser type if needed, or ensure types match
                        setDbUser(user as unknown as CustomUser);
                    }
                } catch (error) {
                    console.error("Failed to sync user:", error);
                } finally {
                    setLoading(false);
                }
            } else if (isLoaded && !isSignedIn) {
                setDbUser(null);
                setLoading(false);
            }
        };

        sync();
    }, [isLoaded, isSignedIn, clerkUser]);

    return {
        user: dbUser,
        loading: !isLoaded || loading,
        error: null,
        clerkUser // Expose raw clerk user if needed
    };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};
