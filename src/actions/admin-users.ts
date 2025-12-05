'use server';

import db from '@/lib/db';
import { syncUser } from './sync-user';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
    const currentUser = await syncUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    return await db.user.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function updateUserRole(userId: string, role: string) {
    const currentUser = await syncUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    await db.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath('/admin/users');
}
