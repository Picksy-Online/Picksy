
'use client';

import { useUser } from '@/firebase';
import React from 'react';

// This is a compatibility layer.
// The rest of the app uses useAuth() to get user info, but Firebase provides this via useUser().
// We'll just re-export useUser as useAuth for now.
// A better solution would be to refactor all useAuth() calls to useUser().

export const useAuth = () => {
    const { user, isUserLoading, userError } = useUser();
    return { user, loading: isUserLoading, error: userError };
}

// The AuthProvider is now handled by the FirebaseClientProvider, 
// so we provide a dummy one here for components that still use it.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};
