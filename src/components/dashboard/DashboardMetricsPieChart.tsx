import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

interface DashboardMetricsPieChartProps {
  data: PieDataPoint[];
}

export function DashboardMetricsPieChart({ data }: DashboardMetricsPieChartProps) {
  return (
    <Card className="col-span-1 md:col-span-1 rounded-3xl border-none shadow-md">
      <CardHeader>
        <CardTitle>Emission Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <div className="sr-only">
          A pie chart showing the emission breakdown.
        </div>
        <ResponsiveContainer width="100%" height="100%" aria-hidden="true">
          <PieChart>
            <Pie
              data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
              paddingAngle={5} dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {data.map((d) => (
            <Badge key={d.name} variant="outline" style={{ borderColor: d.color, color: d.color }}>
              {d.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
