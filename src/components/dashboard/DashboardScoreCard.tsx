import { Card } from "@/components/ui/card";

interface DashboardScoreCardProps {
  score: number;
  message: string;
}

export function DashboardScoreCard({ score, message }: DashboardScoreCardProps) {
  return (
    <Card className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl shadow-green-500/20 border-none rounded-3xl">
      <h2 className="text-xl font-poppins font-semibold mb-6">
        Sustainability Score
      </h2>
      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="10"
            strokeDasharray={`${score * 2.82} 282`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-bold font-poppins">
            {score}
          </span>
          <span className="text-sm opacity-80">/ 100</span>
        </div>
      </div>
      <p className="text-center font-medium opacity-90">{message}</p>
    </Card>
  );
}
