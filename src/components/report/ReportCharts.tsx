import { Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, PieChart, Pie } from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReportCharts({ benchmarkChartData, currentTier, currentPercentile, benchmarkInsight, barChartData, pieData }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2 flex items-center gap-2"><Globe className="text-blue-500" /> Global Impact Comparison</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 text-center">Benchmark Chart</h3>
          <div className="flex justify-center">
            <BarChart width={300} height={180} data={benchmarkChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="font-bold text-[10px]" width={60} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {benchmarkChartData.map((entry: {name: string, value: number, fill: string}, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <LabelList dataKey="value" position="right" formatter={(val: any) => `${val}`} className="font-bold text-[10px]" />
              </Bar>
            </BarChart>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-sm text-slate-500 uppercase font-bold">Sustainability Tier</span>
            <p className={`text-xl font-bold ${currentTier.textColor}`}>{currentTier.name}</p>
          </div>
          <div className="mb-4">
            <span className="text-sm text-slate-500 uppercase font-bold">Global Percentile</span>
            <p className="text-xl font-bold text-slate-800">Top {100 - currentPercentile}%</p>
          </div>
          <div className={`p-3 rounded-lg border ${
              benchmarkInsight.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              benchmarkInsight.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
            <p className="font-bold text-sm mb-1">{benchmarkInsight.title}</p>
            <p className="text-xs">{benchmarkInsight.message}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4 border-b pb-2">Analytics</h2>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 text-center">Carbon Forecast</h3>
          <div className="flex justify-center">
            <BarChart width={300} height={200} data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="font-bold text-[10px]" width={60} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {barChartData.map((entry: {name: string, value: number, fill: string}, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <LabelList dataKey="value" position="right" formatter={(val: any) => `${val}`} className="font-bold text-[10px]" />
              </Bar>
            </BarChart>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 text-center">Emission Breakdown</h3>
          <div className="flex justify-center">
            <PieChart width={300} height={200}>
              <Pie
                data={pieData} cx={150} cy={100} innerRadius={40} outerRadius={80} paddingAngle={5}
                dataKey="value" isAnimationActive={false}
              >
                {pieData.map((entry: {name: string, value: number, color: string}, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
    </>
  );
}
