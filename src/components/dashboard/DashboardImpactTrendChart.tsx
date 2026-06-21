import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

interface LineDataPoint {
  date: string;
  Carbon: number;
  Score: number;
}

interface DashboardImpactTrendChartProps {
  data: LineDataPoint[];
}

export function DashboardImpactTrendChart({ data }: DashboardImpactTrendChartProps) {
  return (
    <Card className="col-span-1 md:col-span-2 rounded-3xl border-none shadow-md">
      <CardHeader>
        <CardTitle>Impact Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <div className="sr-only">
          A line chart showing your impact trend over time.
        </div>
        <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <RechartsTooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="Carbon" stroke="#ef4444" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="Score" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
