"use client";
import { Task } from "@/lib/types/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

type ContinueLearningCardProps = {
  task: Task | null;
};

export function ContinueLearningCard({ task }: ContinueLearningCardProps) {
  const difficultyColor =
    task?.difficulty === "EASY"
      ? "text-green-500"
      : task?.difficulty === "MEDIUM"
      ? "text-yellow-500"
      : "text-red-500";
  return (
    <Card className="col-span-1 md:col-span-2 flex flex-col h-full">
      {" "}
      <CardHeader>
        <CardTitle>Continue Learning</CardTitle>
        <CardDescription>
          {task ? "Pick up where you left off." : "Start a new challenge!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {task && task.user_progress ? (
          <div>
            <h3 className="font-semibold mb-1">{task.title}</h3>
            <span
              className={`text-xs sm:text-sm font-semibold ${difficultyColor}`}
            >
              {task.difficulty}
            </span>
            <div className="flex items-center gap-2">
              <Progress
                value={task.user_progress.progress}
                className="h-2 flex-grow"
              />
              <span className="text-xs font-medium text-muted-foreground">
                {task.user_progress.progress.toFixed(0)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No tasks currently in progress. Why not start one?
          </div>
        )}
      </CardContent>
      <CardFooter>
        {task ? (
          <Button asChild className="w-full" variant="secondary">
            <Link href={`/courses/${task.ID}`}>
              <Play className="w-4 h-4 mr-2" /> Continue Task
            </Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="w-full">
            <Link href="/courses">
              Browse Courses <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
