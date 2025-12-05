'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { updateUserRole } from '@/actions/admin-users';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleRoleChange = async (newRole: string) => {
        setLoading(true);
        try {
            await updateUserRole(userId, newRole);
            toast({
                title: "Role updated",
                description: "The user's role has been successfully updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update role.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select defaultValue={currentRole} onValueChange={handleRoleChange} disabled={loading}>
            <SelectTrigger className="w-[120px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
        </Select>
    );
}
