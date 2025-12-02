'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, ShieldAlert, MessageSquare, Activity } from 'lucide-react';
import { users } from '@/lib/data';

// Mock data for logs (since backend isn't fully ready)
const MOCK_LOGS = {
    messages: [
        { id: 1, from: 'System', content: 'Welcome to Picksy!', date: '2023-10-25 10:00' },
        { id: 2, from: 'Buyer A', content: 'Is this item available?', date: '2023-10-26 14:30' },
        { id: 3, from: 'Seller B', content: 'Yes, it is!', date: '2023-10-26 14:35' },
    ],
    events: [
        { id: 1, type: 'LOGIN', description: 'User logged in', date: '2023-10-25 09:55', ip: '192.168.1.1' },
        { id: 2, type: 'PURCHASE', description: 'Purchased Item #123', date: '2023-10-27 11:20', ip: '192.168.1.1' },
        { id: 3, type: 'UPDATE_PROFILE', description: 'Updated bio', date: '2023-10-28 16:45', ip: '192.168.1.1' },
    ]
};

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">User Management</h1>
                <p className="text-muted-foreground">
                    View and monitor all buyers and sellers. Access message logs and event history for transparency.
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name || 'Unknown'}</TableCell>
                                <TableCell>{user.email || 'No Email'}</TableCell>
                                <TableCell>
                                    <Badge variant={!!user.storeName ? "default" : "secondary"}>
                                        {!!user.storeName ? 'Seller' : 'Buyer'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                                            <DialogHeader>
                                                <DialogTitle>User Details: {user.name || 'Unknown'}</DialogTitle>
                                                <DialogDescription>
                                                    Transparency Log & Activity Monitor
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="flex-1 overflow-hidden mt-4">
                                                <Tabs defaultValue="info" className="h-full flex flex-col">
                                                    <TabsList>
                                                        <TabsTrigger value="info">Profile Info</TabsTrigger>
                                                        <TabsTrigger value="messages">Message Log</TabsTrigger>
                                                        <TabsTrigger value="events">Event Log</TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="info" className="flex-1 overflow-auto p-4 border rounded-md mt-2">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <h3 className="font-semibold mb-2">Personal Information</h3>
                                                                <div className="space-y-1 text-sm">
                                                                    <p><span className="text-muted-foreground">ID:</span> {user.id}</p>
                                                                    <p><span className="text-muted-foreground">Email:</span> {user.email || 'N/A'}</p>
                                                                    <p><span className="text-muted-foreground">Role:</span> {!!user.storeName ? 'Seller' : 'Buyer'}</p>
                                                                    <p><span className="text-muted-foreground">Postcode:</span> {user.postcode}</p>
                                                                </div>
                                                            </div>
                                                            {!!user.storeName && (
                                                                <div>
                                                                    <h3 className="font-semibold mb-2">Store Information</h3>
                                                                    <div className="space-y-1 text-sm">
                                                                        <p><span className="text-muted-foreground">Store Name:</span> {user.storeName || 'N/A'}</p>
                                                                        <p><span className="text-muted-foreground">Bio:</span> {user.bio || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TabsContent>

                                                    <TabsContent value="messages" className="flex-1 overflow-hidden flex flex-col mt-2">
                                                        <div className="border rounded-md flex-1 overflow-hidden flex flex-col">
                                                            <div className="bg-muted p-2 border-b flex items-center">
                                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                                <span className="font-semibold text-sm">Message History</span>
                                                            </div>
                                                            <ScrollArea className="flex-1 p-4">
                                                                <div className="space-y-4">
                                                                    {MOCK_LOGS.messages.map((msg) => (
                                                                        <div key={msg.id} className="flex flex-col space-y-1 pb-4 border-b last:border-0">
                                                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                                                <span>From: {msg.from}</span>
                                                                                <span>{msg.date}</span>
                                                                            </div>
                                                                            <p className="text-sm">{msg.content}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </ScrollArea>
                                                        </div>
                                                    </TabsContent>

                                                    <TabsContent value="events" className="flex-1 overflow-hidden flex flex-col mt-2">
                                                        <div className="border rounded-md flex-1 overflow-hidden flex flex-col">
                                                            <div className="bg-muted p-2 border-b flex items-center">
                                                                <Activity className="w-4 h-4 mr-2" />
                                                                <span className="font-semibold text-sm">System Events & Audit Log</span>
                                                            </div>
                                                            <ScrollArea className="flex-1 p-4">
                                                                <div className="space-y-4">
                                                                    {MOCK_LOGS.events.map((event) => (
                                                                        <div key={event.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                                                                            <ShieldAlert className="w-4 h-4 text-blue-500 mt-0.5" />
                                                                            <div className="flex-1 space-y-1">
                                                                                <div className="flex justify-between items-center">
                                                                                    <span className="font-medium text-sm">{event.type}</span>
                                                                                    <span className="text-xs text-muted-foreground">{event.date}</span>
                                                                                </div>
                                                                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                                                                <p className="text-xs text-muted-foreground font-mono">IP: {event.ip}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </ScrollArea>
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
