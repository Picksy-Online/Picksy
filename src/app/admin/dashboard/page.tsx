
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Box,
  MessageSquareWarning,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Active Sellers",
    value: "+2,350",
    change: "+180.1% from last month",
    icon: Users,
  },
  {
    title: "Products Listed",
    value: "+12,234",
    change: "+19% from last month",
    icon: Box,
  },
  {
    title: "Open Disputes",
    value: "573",
    change: "+201 since last hour",
    icon: MessageSquareWarning,
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="sr-only">Admin Dashboard</h1>
      <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A log of recent events on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Recent activity feed coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
