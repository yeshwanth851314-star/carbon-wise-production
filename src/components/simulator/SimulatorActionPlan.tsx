import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap } from "lucide-react";

interface SimulatorActionPlanProps {
  loadingAI: boolean;
  actionPlanTasks: Array<{day: number, task: string, completed: boolean}>;
  toggleActionPlanTask: (day: number) => void;
}

export function SimulatorActionPlan({ loadingAI, actionPlanTasks, toggleActionPlanTask }: SimulatorActionPlanProps) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500"/> Your 7-Day Green Plan
        </CardTitle>
        {loadingAI && <span className="text-xs text-slate-400 animate-pulse">Generating AI Plan...</span>}
      </CardHeader>
      <CardContent>
        {actionPlanTasks.length > 0 ? (
          <div className="space-y-3">
            {actionPlanTasks.map((task) => (
              <div 
                key={task.day} 
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${task.completed ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-slate-50 border-slate-100 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}
                onClick={() => toggleActionPlanTask(task.day)}
                onKeyDown={(e) => e.key === 'Enter' && toggleActionPlanTask(task.day)}
                tabIndex={0}
                role="checkbox"
                aria-checked={task.completed}
              >
                <div className={`p-1 rounded-full ${task.completed ? 'bg-green-500 text-white' : 'border-2 border-slate-300 text-transparent'}`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase ${task.completed ? 'text-green-600' : 'text-slate-500'}`}>Day {task.day}</p>
                  <p className={`text-sm ${task.completed ? 'text-green-800 line-through dark:text-green-200' : 'text-slate-700 dark:text-slate-300'}`}>{task.task}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-slate-500 border-2 border-dashed rounded-xl">
            Adjust the sliders to generate your personalized AI action plan!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
