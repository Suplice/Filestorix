// Path: components/quiz/QuizFinishedScreen.tsx

"use client";

import Link from "next/link";
import { Task } from "@/lib/types/task";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Import Progress
import { CheckCircle, RotateCcw, Star } from "lucide-react"; // Import Star
import { useAuth } from "@/context/AuthContext"; // Import useAuth to get current user XP/Level
import { getXpForNextLevel } from "@/lib/utils/xpUtils"; // Import XP utilities

type QuizFinishedScreenProps = {
  task: Task;
  isPracticeMode: boolean;
};

export function QuizFinishedScreen({
  task,
  isPracticeMode,
}: QuizFinishedScreenProps) {
  const { user } = useAuth(); // Get current user

  // Calculate XP progress if user exists
  const xpProgress = user ? getXpForNextLevel(user.level, user.xp) : null;

  const onTryAgain = () => {
    // Navigate back to the same course in practice mode
    // Using window.location.reload() might not preserve the state correctly if you came from elsewhere.
    // Better to use Next.js router if available, or construct the link.
    // For simplicity, reload works for now if you directly entered the URL with ?mode=practice
    window.location.reload();
    // Or potentially: router.push(`/courses/${task.ID}?mode=practice`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {" "}
      {/* Added min-h, text-center, px-4 */}
      {/* Icon */}
      {isPracticeMode ? (
        <RotateCcw className="w-20 h-20 sm:w-24 sm:h-24 text-blue-500 mb-6" />
      ) : (
        <CheckCircle className="w-20 h-20 sm:w-24 sm:h-24 text-green-500 mb-6" />
      )}
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">
        {isPracticeMode ? "Practice Complete!" : "Task Complete!"}
      </h1>
      {/* Message */}
      {isPracticeMode ? (
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md">
          {" "}
          {/* Added max-w-md */}
          Great job practicing! Feel free to try again or return to the course
          list.
        </p>
      ) : (
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-md">
          {" "}
          {/* Added max-w-md */}
          Congratulations! You earned{" "}
          <span className="font-semibold text-primary">
            {task.xp} XP
          </span> and{" "}
          <span className="font-semibold text-primary">
            {task.points} Points
          </span>
          .
        </p>
      )}
      {/* --- XP PROGRESS BAR (Show only if not practice mode and user data available) --- */}
      {!isPracticeMode && user && xpProgress && (
        <div className="w-full max-w-md mb-8 px-4">
          {" "}
          {/* Limit width */}
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              Lv. {user.level} ({xpProgress.xpForCurrentLevel} XP)
            </span>
            {xpProgress.nextLevel !== null ? ( // Show next level only if it exists
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
      {/* --- END XP PROGRESS BAR --- */}
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
        {" "}
        {/* Responsive button layout */}
        {isPracticeMode && (
          <Button
            size="lg"
            variant="secondary"
            onClick={onTryAgain}
            className="w-full"
          >
            {" "}
            {/* Changed variant */}
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
