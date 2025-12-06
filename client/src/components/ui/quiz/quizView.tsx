"use client";

import Link from "next/link";
import { Task, TaskQuestion } from "@/lib/types/task";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Lightbulb, LogOut, Info } from "lucide-react";
import { QuestionRenderer } from "./questionRenderer";

type QuizViewProps = {
  task: Task;
  currentQuestion: TaskQuestion;
  optionsForCurrentQuestion: string[];
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercent: number;
  isHintUsed: boolean;
  isPracticeMode: boolean;
  feedback: "correct" | "incorrect" | null;
  isSubmitting: boolean;
  currentAnswer: string;
  handleUseHint: () => void;
  handleCheckAnswer: () => void;
  setCurrentAnswer: (value: string) => void;
};

export function QuizView({
  task,
  currentQuestion,
  optionsForCurrentQuestion,
  currentQuestionIndex,
  totalQuestions,
  progressPercent,
  isHintUsed,
  feedback,
  isPracticeMode,
  isSubmitting,
  currentAnswer,
  handleUseHint,
  handleCheckAnswer,
  setCurrentAnswer,
}: QuizViewProps) {
  const feedbackBg =
    feedback === "correct"
      ? "bg-green-100 dark:bg-green-900/50 border-green-500"
      : feedback === "incorrect"
      ? "bg-red-100 dark:bg-red-900/50 border-red-500"
      : "bg-card border-border";

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-3">{task.title}</h1>
        <p className="text-muted-foreground mb-4">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
        <Progress value={progressPercent} className="w-full h-2" />
      </div>

      <div className="flex justify-end items-center mb-8">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleUseHint}
          disabled={isHintUsed}
          className="flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          {isHintUsed ? "Hint used" : "Use hint (1)"}
        </Button>
      </div>
      {isPracticeMode && (
        <div className="mb-6 p-3 bg-blue-100 dark:bg-blue-900/50 border border-blue-500 rounded-lg text-center flex items-center justify-center gap-2">
          <Info className="w-5 h-5 text-blue-700 dark:text-blue-300" />
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Training mode, no xp nor points will be gained after completion.
          </p>
        </div>
      )}

      <div
        className={`border rounded-lg p-6 mb-6 transition-all ${feedbackBg}`}
      >
        <QuestionRenderer
          question={currentQuestion}
          options={optionsForCurrentQuestion}
          answer={currentAnswer}
          onAnswerChange={setCurrentAnswer}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-between items-center min-h-[48px]">
        <Button asChild variant="outline" size="lg">
          <Link href="/courses" className="flex items-center gap-2">
            <LogOut className="w-8 h-8" />
            Leave
          </Link>
        </Button>
        {feedback === "correct" && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">Correct Answer!</span>
          </div>
        )}
        {feedback === "incorrect" && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="w-6 h-6" />
            <span className="font-medium">Incorrect. Try again.</span>
          </div>
        )}
        {!feedback && (
          <Button
            size="lg"
            onClick={handleCheckAnswer}
            disabled={isSubmitting || !currentAnswer}
            className="ml-auto"
          >
            {isSubmitting ? "Checking..." : "Check Answer"}
          </Button>
        )}
      </div>
    </div>
  );
}
