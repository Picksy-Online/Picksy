import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="sr-only">Sales Analytics</h1>
      <AnalyticsCharts />
    </div>
  );
}
