"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Leaf,
  Droplets,
  TreePine,
  Zap,
  Car,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Award,
  ArrowUpCircle,
} from "lucide-react";
import { format } from "date-fns";
import { logDailyAction } from "@/app/actions";

export default function DashboardClient({
  assessment,
  historicalAssessments,
  recommendations,
  metrics,
  user,
}: any) {
  const [logging, setLogging] = useState(false);
  const [logData, setLogData] = useState({
    walkingKm: 0,
    cyclingKm: 0,
    publicTransportKm: 0,
    plasticSaved: 0,
  });

  const handleLogSubmit = async () => {
    setLogging(true);
    try {
      await logDailyAction(logData);
      alert("Successfully logged daily activity! +10 XP");
      setLogData({
        walkingKm: 0,
        cyclingKm: 0,
        publicTransportKm: 0,
        plasticSaved: 0,
      });
    } catch (e) {
      alert("Error logging activity");
    }
    setLogging(false);
  };

  const pieData = [
    { name: "Transport", value: assessment.transportScore, color: "#3b82f6" },
    { name: "Energy", value: assessment.energyScore, color: "#eab308" },
    { name: "Food", value: assessment.foodScore, color: "#f97316" },
    { name: "Shopping", value: assessment.shoppingScore, color: "#a855f7" },
    { name: "Waste", value: assessment.wasteScore, color: "#64748b" },
  ];

  const lineData = historicalAssessments.map((a: any) => ({
    date: format(new Date(a.createdAt), "MMM dd"),
    Carbon: a.totalEmissions,
    Score: a.sustainabilityScore,
  }));

  let message = "You're doing great! Keep finding small ways to reduce.";
  if (assessment.sustainabilityScore > 80)
    message = "Exceptional work! You're a true sustainability champion.";
  if (assessment.sustainabilityScore < 40)
    message = "There is a lot of room for improvement. The AI Coach can help!";

  const totalWalked =
    user?.dailyLogs?.reduce(
      (sum: number, log: any) => sum + (log.walkingKm || 0),
      0,
    ) || 0;
  const walkProgress = Math.min((totalWalked / 5) * 100, 100);

  const totalPlastic =
    user?.dailyLogs?.reduce(
      (sum: number, log: any) => sum + (log.plasticSaved || 0),
      0,
    ) || 0;
  const plasticProgress = Math.min((totalPlastic / 10) * 100, 100);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-200 dark:bg-slate-800 rounded-full h-12">
        <TabsTrigger
          value="overview"
          className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="log"
          className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
        >
          Log Activity
        </TabsTrigger>
        <TabsTrigger
          value="challenges"
          className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
        >
          Gamification
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl shadow-green-500/20 border-none rounded-3xl">
            <h2 className="text-xl font-poppins font-semibold mb-6">
              Sustainability Score
            </h2>
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="10"
                  strokeDasharray={`${assessment.sustainabilityScore * 2.82} 282`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-bold font-poppins">
                  {assessment.sustainabilityScore}
                </span>
                <span className="text-sm opacity-80">/ 100</span>
              </div>
            </div>
            <p className="text-center font-medium opacity-90">{message}</p>
          </Card>

          <div className="col-span-1 md:col-span-3 lg:col-span-2 grid grid-cols-2 gap-4">
            <Card className="rounded-3xl border-none shadow-md">
              <CardHeader className="pb-2">
                <CardDescription>Monthly Footprint</CardDescription>
                <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  {assessment.totalEmissions}{" "}
                  <span className="text-base font-normal text-slate-500">
                    kg CO₂
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl border-none shadow-md">
              <CardHeader className="pb-2">
                <CardDescription>Carbon Saved</CardDescription>
                <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-green-500" />
                  {Math.round(metrics.totalCarbonSaved)}{" "}
                  <span className="text-base font-normal text-slate-500">
                    kg
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl border-none shadow-md">
              <CardHeader className="pb-2">
                <CardDescription>Trees Equivalent</CardDescription>
                <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                  <TreePine className="w-6 h-6 text-emerald-600" />
                  {metrics.treesEquivalent}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-3xl border-none shadow-md">
              <CardHeader className="pb-2">
                <CardDescription>Water Saved</CardDescription>
                <CardTitle className="text-3xl font-poppins flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  {metrics.waterSaved}{" "}
                  <span className="text-base font-normal text-slate-500">
                    L
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="col-span-1 md:col-span-1 rounded-3xl border-none shadow-md">
            <CardHeader>
              <CardTitle>Emission Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {pieData.map((d) => (
                  <Badge
                    key={d.name}
                    variant="outline"
                    style={{ borderColor: d.color, color: d.color }}
                  >
                    {d.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 rounded-3xl border-none shadow-md">
            <CardHeader>
              <CardTitle>Impact Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Carbon"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="Score"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-3 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <Zap className="w-6 h-6 text-blue-500" />
                AI Sustainability Coach
              </CardTitle>
              <CardDescription>
                Personalized insights generated by Gemini AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec: any) => (
                    <div
                      key={rec.id}
                      className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-slate-800 dark:text-slate-200 mb-4">
                        {rec.recommendation}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600 font-semibold bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                          Save {rec.estimatedSavings} kg CO₂
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">
                    Generating personalized insights... Check back soon.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="log">
        <Card className="max-w-2xl mx-auto rounded-3xl border-none shadow-md mt-6">
          <CardHeader>
            <CardTitle>Log Daily Eco-Activity</CardTitle>
            <CardDescription>
              Every sustainable choice helps reduce your footprint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Walked (km)</Label>
                <Input
                  type="number"
                  value={logData.walkingKm || ""}
                  onChange={(e) =>
                    setLogData({
                      ...logData,
                      walkingKm: Number(e.target.value),
                    })
                  }
                  placeholder="e.g. 2"
                />
              </div>
              <div className="space-y-2">
                <Label>Cycled (km)</Label>
                <Input
                  type="number"
                  value={logData.cyclingKm || ""}
                  onChange={(e) =>
                    setLogData({
                      ...logData,
                      cyclingKm: Number(e.target.value),
                    })
                  }
                  placeholder="e.g. 5"
                />
              </div>
              <div className="space-y-2">
                <Label>Public Transit (km)</Label>
                <Input
                  type="number"
                  value={logData.publicTransportKm || ""}
                  onChange={(e) =>
                    setLogData({
                      ...logData,
                      publicTransportKm: Number(e.target.value),
                    })
                  }
                  placeholder="e.g. 10"
                />
              </div>
              <div className="space-y-2">
                <Label>Plastic Bottles Avoided</Label>
                <Input
                  type="number"
                  value={logData.plasticSaved || ""}
                  onChange={(e) =>
                    setLogData({
                      ...logData,
                      plasticSaved: Number(e.target.value),
                    })
                  }
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            <Button
              onClick={handleLogSubmit}
              disabled={logging}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 rounded-full h-12 text-lg"
            >
              {logging ? "Logging..." : "Log Activity & Earn XP"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="challenges">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="rounded-3xl border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpCircle className="w-6 h-6 text-purple-500" />
                Level & XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">
                  Level {user?.level || 1}
                </span>
                <span className="text-slate-500">
                  {user?.xp || 0} / {(user?.level || 1) * 100} XP
                </span>
              </div>
              <Progress
                value={(user?.xp || 0) % 100}
                className="h-3 bg-slate-100"
              />
              <p className="text-sm text-slate-500 mt-4">
                Earn XP by completing assessments and logging daily
                eco-activities.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Avoid 10 Plastic Bottles</h4>
                  <Badge variant="secondary">+100 XP</Badge>
                </div>
                <Progress value={plasticProgress} className="h-2 mb-2" />
                <p className="text-xs text-slate-500">
                  {totalPlastic} / 10 bottles avoided
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Walk 5km</h4>
                  <Badge variant="secondary">+50 XP</Badge>
                </div>
                <Progress value={walkProgress} className="h-2 mb-2" />
                <p className="text-xs text-slate-500">
                  {totalWalked} / 5 km walked
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
