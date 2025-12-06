"use client";

import Link from "next/link";
import { Task } from "@/lib/types/task";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, RotateCcw, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getXpForNextLevel } from "@/lib/utils/xpUtils";

type QuizFinishedScreenProps = {
  task: Task;
  isPracticeMode: boolean;
};

export function QuizFinishedScreen({
  task,
  isPracticeMode,
}: QuizFinishedScreenProps) {
  const { user } = useAuth();

  const xpProgress = user ? getXpForNextLevel(user.level, user.xp) : null;

  const onTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {isPracticeMode ? (
        <RotateCcw className="w-20 h-20 sm:w-24 sm:h-24 text-blue-500 mb-6" />
      ) : (
        <CheckCircle className="w-20 h-20 sm:w-24 sm:h-24 text-green-500 mb-6" />
      )}
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">
        {isPracticeMode ? "Practice Complete!" : "Task Complete!"}
      </h1>
      {isPracticeMode ? (
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md">
          Great job practicing! Feel free to try again or return to the course
          list.
        </p>
      ) : (
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md">
          Congratulations! You earned{" "}
          <span className="font-semibold text-primary">{task.xp} XP</span> and{" "}
          <span className="font-semibold text-primary">
            {task.points} Points
          </span>
          .
        </p>
      )}
      {!isPracticeMode && user && xpProgress && (
        <div className="w-full max-w-md mb-8 px-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              Lv. {user.level} ({xpProgress.xpForCurrentLevel} XP)
            </span>
            {xpProgress.nextLevel !== null ? (
              <span className="flex items-center gap-1">
                Lv. {xpProgress.nextLevel} ({xpProgress.xpForNextLevel} XP)
                <Star className="w-3 h-3 text-yellow-400" />
              </span>
            ) : (
              <span className="font-medium text-primary">Max Level</span>
            )}
          </div>
          <Progress value={xpProgress.progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {user.xp} Total XP
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
        {isPracticeMode && (
          <Button
            size="lg"
            variant="secondary"
            onClick={onTryAgain}
            className="w-full"
          >
            Try Again
          </Button>
        )}
        <Button asChild size="lg" className="w-full">
          <Link href="/courses">Back to Courses</Link>
        </Button>
      </div>
    </div>
  );
}
