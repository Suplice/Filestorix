// Ścieżka pliku: components/quiz/QuizFinishedScreen.tsx

"use client";

import Link from "next/link";
import { Task } from "@/lib/types/task";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

type QuizFinishedScreenProps = {
  task: Task;
};

export function QuizFinishedScreen({ task }: QuizFinishedScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-5xl font-bold mb-4">Ukończono!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Gratulacje! Zdobywasz {task.xp} XP i {task.points} punktów.
      </p>
      <Button asChild size="lg">
        <Link href="/courses">Wróć do listy zadań</Link>
      </Button>
    </div>
  );
}
