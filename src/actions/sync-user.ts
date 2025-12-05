'use server';

import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { User } from '@prisma/client';

export async function syncUser(): Promise<User | null> {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
        return null;
    }

    const existingUser = await db.user.findUnique({
        where: {
            id: clerkUser.id,
        },
    });

    if (existingUser) {
        return existingUser;
    }

    const newUser = await db.user.create({
        data: {
            id: clerkUser.id,
            email: email,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            avatarUrl: clerkUser.imageUrl,
            role: 'USER', // Default role
        },
    });

    return newUser;
}
