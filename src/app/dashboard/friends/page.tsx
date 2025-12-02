
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { users } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

// Mock data for friends and requests
const friends = [users.find(u => u.id === 'user_1')];
const friendRequests = [users.find(u => u.id === 'user_3')];

export default function FriendsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Friends Management</h1>
        <p className="text-muted-foreground">
          Manage your friend list to grant access to private collections.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Friend Requests</CardTitle>
          <CardDescription>
            Review and approve requests from users who want to access your private content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {friendRequests.map(user => user && (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">{user.storeName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="outline">Decline</Button>
                  </TableCell>
                </TableRow>
              ))}
              {friendRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">No pending friend requests.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Friends</CardTitle>
          <CardDescription>
            This is a list of users who have access to your private collections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {friends.map(user => user && (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">{user.storeName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="destructive">Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
              {friends.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">You haven't added any friends yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
