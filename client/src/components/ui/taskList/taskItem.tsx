"use client";

import { Task } from "@/lib/types/task";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const userProgress = task.user_progress;
  const progress = userProgress?.progress ?? 0;
  const isCompleted = userProgress?.is_completed ?? false;

  const difficultyColor =
    task.difficulty === "EASY"
      ? "text-green-500"
      : task.difficulty === "MEDIUM"
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div
      className={`
        flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all shadow-sm 
        
        /* Zastosowano style light/dark Tailwinda */
        bg-white border-gray-200 hover:bg-gray-50
        dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800
      `}
    >
      <div className="flex items-center gap-4 w-2/3">
        <div className="w-6 h-6 flex items-center justify-center">
          {isCompleted ? (
            <CheckCircle className="text-green-500 w-5 h-5" />
          ) : (
            <Clock className="text-gray-400 w-5 h-5" />
          )}
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2">
            <span
              className={`
                font-medium text-sm sm:text-base
                
                /* Zastosowano style light/dark Tailwinda */
                text-gray-900 dark:text-zinc-100
              `}
            >
              {task.title}
            </span>
            {(isCompleted || userProgress) && (
              <Badge
                variant={isCompleted ? "default" : "secondary"}
                className="text-xs"
              >
                {isCompleted ? "Completed" : userProgress ? "In Progress" : ""}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <Progress value={progress} className="w-40 h-1.5 bg-muted" />
            <span className="text-xs text-muted-foreground">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`text-xs sm:text-sm font-semibold ${difficultyColor}`}>
          {task.difficulty}
        </span>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {task.language}
        </span>
        <span
          className={`
            text-xs sm:text-sm font-medium
            
            /* Zastosowano style light/dark Tailwinda */
            text-gray-700 dark:text-zinc-300
          `}
        >
          +{task.xp} XP / {task.points} pts
        </span>
        <Button asChild size="sm" variant="outline">
          <Link href={`/courses/${task.ID}`}>
            {isCompleted ? "Retry" : userProgress ? "Continue" : "Start"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
