import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowUpCircle } from "lucide-react";

interface DashboardGamificationTabProps {
  user: {
    level: number;
    xp: number;
    dailyLogs?: Array<{ walkingKm?: number; plasticSaved?: number }>;
    userChallenges?: Array<{ id: string; progress: number }>;
  };
}

/**
 * Renders the gamification tab showing user levels, XP, and active challenges.
 */
export function DashboardGamificationTab({ user }: DashboardGamificationTabProps) {
  const totalWalked =
    user?.dailyLogs?.reduce(
      (sum: number, log: { walkingKm?: number }) => sum + (log.walkingKm || 0),
      0,
    ) || 0;
  const walkProgress = Math.min((totalWalked / 5) * 100, 100);

  const totalPlastic =
    user?.dailyLogs?.reduce(
      (sum: number, log: { plasticSaved?: number }) => sum + (log.plasticSaved || 0),
      0,
    ) || 0;
  const plasticProgress = Math.min((totalPlastic / 10) * 100, 100);

  return (
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
  );
}
