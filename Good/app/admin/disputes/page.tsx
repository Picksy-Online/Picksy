
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDisputesPage() {
  return (
    <div>
      <h1 className="sr-only">Manage Disputes</h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Open Disputes</CardTitle>
          <CardDescription>
            Disputes requiring your attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Dispute management system coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
