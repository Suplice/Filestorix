// Ścieżka: components/tasks/TaskItem.tsx

"use client";

import { Task } from "@/lib/types/task";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Dodaj nowe ikony
import { CheckCircle, Clock, Target, CircleAlert } from "lucide-react";
import Link from "next/link";

type TaskItemProps = {
  task: Task;
  isMyTask?: boolean;
};

export function TaskItem({ task, isMyTask = true }: TaskItemProps) {
  const userProgress = task.user_progress;
  const progress = userProgress?.progress ?? 0;
  const isCompleted = userProgress?.is_completed ?? false;
  const attempts = userProgress?.attempts ?? 0; // Pobierz próby
  const mistakes = userProgress?.mistakes ?? 0; // Pobierz błędy

  const difficultyColor =
    task.difficulty === "EASY"
      ? "text-green-500"
      : task.difficulty === "MEDIUM"
      ? "text-yellow-500"
      : "text-red-500";

  // Zbuduj link dynamicznie
  const href = isCompleted
    ? `/courses/${task.ID}?mode=practice` // Dodaj parametr dla "Retry"
    : `/courses/${task.ID}`;

  return (
    <div
      className={`
        flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all shadow-sm
        bg-white border-gray-200 hover:bg-gray-50
        dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800
      `}
    >
      {/* Lewa strona - rozbudowana */}
      <div className="flex items-center gap-4 w-2/3">
        {/* Ikona statusu */}
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          {isCompleted ? (
            <CheckCircle className="text-green-500 w-5 h-5" />
          ) : (
            <Clock className="text-gray-400 w-5 h-5" />
          )}
        </div>

        {/* Tytuł, Badge, Postęp i Statystyki */}
        <div className="flex flex-col w-full overflow-hidden">
          {/* Tytuł i Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`
                font-medium text-sm sm:text-base truncate
                text-gray-900 dark:text-zinc-100
              `}
              title={task.title} // Tooltip dla długich tytułów
            >
              {task.title}
            </span>
            {(isCompleted || (userProgress && attempts > 0)) && ( // Pokaż badge jeśli ukończone lub rozpoczęte
              <Badge
                variant={isCompleted ? "default" : "secondary"}
                className="text-xs flex-shrink-0"
              >
                {isCompleted ? "Completed" : "In Progress"}
              </Badge>
            )}
          </div>

          {/* Postęp */}
          <div className="flex items-center gap-3 mt-1">
            <Progress value={progress} className="w-40 h-1.5 bg-muted" />
            <span className="text-xs text-muted-foreground">
              {progress.toFixed(0)}%
            </span>
          </div>

          {/* --- NOWA SEKCJA: Statystyki Prób/Błędów --- */}
          {userProgress &&
            attempts > 0 &&
            !isCompleted && ( // Pokaż tylko jeśli rozpoczęte i nieukończone
              <div className="flex items-center gap-4 mt-1.5">
                <div
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                  title="Attempts"
                >
                  <Target className="w-3 h-3" />
                  <span>{attempts}</span>
                </div>
                <div
                  className="flex items-center gap-1 text-xs text-red-600 dark:text-red-500"
                  title="Mistakes"
                >
                  <CircleAlert className="w-3 h-3" />
                  <span>{mistakes}</span>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Prawa strona */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className={`text-xs sm:text-sm font-semibold ${difficultyColor}`}>
          {task.difficulty}
        </span>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {task.language}
        </span>
        <span
          className={`
            text-xs sm:text-sm font-medium
            text-gray-700 dark:text-zinc-300
          `}
        >
          +{task.xp} XP / {task.points} pts
        </span>
        {isMyTask && (
          <Button asChild size="sm" variant="outline">
            <Link href={href}>
              {isCompleted ? "Retry" : userProgress ? "Continue" : "Start"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
