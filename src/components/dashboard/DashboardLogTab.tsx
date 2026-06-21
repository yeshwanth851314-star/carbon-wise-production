import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { logger } from "@/lib/logger";

/**
 * Renders the daily logging tab on the dashboard, allowing users to track sustainable habits.
 */
export function DashboardLogTab() {
  const [logging, setLogging] = useState(false);
  const addDailyLog = useStore((state) => state.addDailyLog);
  
  const [logData, setLogData] = useState({
    walkingKm: 0,
    cyclingKm: 0,
    publicTransportKm: 0,
    plasticSaved: 0,
  });

  const handleLogSubmit = () => {
    setLogging(true);
    try {
      const carbonSaved = 
        (logData.walkingKm * 0.15) + 
        (logData.cyclingKm * 0.15) + 
        (logData.plasticSaved * 0.08);

      addDailyLog({
        ...logData,
        carbonSaved
      });
      alert("Successfully logged daily activity! +20 XP");
      setLogData({
        walkingKm: 0,
        cyclingKm: 0,
        publicTransportKm: 0,
        plasticSaved: 0,
      });
    } catch (error) {
      logger.error("Failed to share", error);
      alert("Error logging activity");
    }
    setLogging(false);
  };

  return (
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
  );
}
