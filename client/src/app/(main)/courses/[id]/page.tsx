"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { LevelUpModal } from "@/components/ui/quiz/levelUpModal";
import { QuizFinishedScreen } from "@/components/ui/quiz/quizFinishedScreen";
import { QuizLoadingSkeleton } from "@/components/ui/quiz/quizLoadingSkeleton";
import { QuizView } from "@/components/ui/quiz/quizView";
import { GetTaskByIdForUser, SubmitAnswerForTask } from "@/lib/api/task";
import { Task, UserAnswer } from "@/lib/types/task";
import { useParams, useSearchParams } from "next/navigation";

export default function CoursePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id as string;
  const mode = searchParams.get("mode");
  const isPracticeMode = mode === "practice";

  const { user, setUser } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [hintedOptions, setHintedOptions] = useState<string[] | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  useEffect(() => {
    if (!user || !id) {
      if (id && !user) setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setCurrentQuestionIndex(0);
      setIsFinished(false);
      setHintedOptions(null);
      setIsHintUsed(false);
      setShowLevelUpModal(false);
      setTask(null);

      try {
        const taskId = parseInt(id, 10);
        if (isNaN(taskId)) {
          console.error("Invalid task ID:", id);
          setLoading(false);
          return;
        }

        const data = await GetTaskByIdForUser(taskId, user.ID);

        if (data) {
          setTask(data);
          const questions = data.task_questions || [];
          const progress = data.user_progress;

          if (progress) {
            if (progress.is_completed && !isPracticeMode) {
              setIsFinished(true);
            } else if (!isPracticeMode && !progress.is_completed) {
              const answers = progress.answers || [];
              const correctlyAnsweredIds = new Set(
                answers
                  .filter((a: UserAnswer) => a.is_correct)
                  .map((a: UserAnswer) => a.task_question_id)
              );

              let firstUnansweredIndex = -1;
              for (let i = 0; i < questions.length; i++) {
                if (
                  questions[i] &&
                  !correctlyAnsweredIds.has(questions[i].ID)
                ) {
                  firstUnansweredIndex = i;
                  break;
                }
              }

              if (firstUnansweredIndex !== -1) {
                setCurrentQuestionIndex(firstUnansweredIndex);
              } else if (questions.length > 0) {
                setIsFinished(true);
              }
            }
          }
        } else {
          console.error("Task data not received for ID:", taskId);
        }
      } catch (error) {
        console.error("Failed to fetch task details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id, isPracticeMode, setUser]);

  const handleUseHint = () => {
    if (isHintUsed || !task) return;

    setIsHintUsed(true);
    const questions = task.task_questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (currentQuestion.type === "QUIZ") {
      const originalOptions: string[] = currentQuestion.options;
      const incorrectOptionToRemove = originalOptions.find(
        (opt) => opt !== correctAnswer
      );
      if (incorrectOptionToRemove) {
        setHintedOptions(
          originalOptions.filter((opt) => opt !== incorrectOptionToRemove)
        );
      }
    } else if (currentQuestion.type === "FILL_BLANK") {
      if (correctAnswer && correctAnswer.length > 0) {
        setCurrentAnswer(correctAnswer.charAt(0));
      }
    }
  };

  const handleCheckAnswer = async () => {
    if (isSubmitting || !task || !user || !currentAnswer) return;

    const questions = task.task_questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const oldLevel = user.level;

    setIsSubmitting(true);

    let isCorrect = false;
    let didLevelUp = false;
    let isTaskCompleted = false;

    if (isPracticeMode) {
      const correctAnswer = currentQuestion.correct_answer;
      isCorrect = stringsEqualFold(currentAnswer, correctAnswer);

      if (isCorrect) {
        setFeedback("correct");
        isTaskCompleted = currentQuestionIndex + 1 >= totalQuestions;
      } else {
        setFeedback("incorrect");
      }

      setTimeout(() => {
        setFeedback(null);
        if (isCorrect) {
          setCurrentAnswer("");
          setHintedOptions(null);
        }
        setIsSubmitting(false);

        if (isCorrect) {
          if (isTaskCompleted) {
            setIsFinished(true);
          } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          }
        }
      }, 1500);

      return;
    }

    try {
      const response = await SubmitAnswerForTask(
        task.ID,
        currentQuestion.ID,
        currentAnswer
      );

      if (response && response.is_correct) {
        setFeedback("correct");
        isCorrect = true;
        isTaskCompleted = response.is_completed;

        if (response.is_completed && response.updated_user) {
          const newUser = response.updated_user;
          setUser(newUser);
          if (newUser.level > oldLevel) {
            didLevelUp = true;
            setNewLevel(newUser.level);
          }
        }
      } else {
        setFeedback("incorrect");
        isCorrect = false;
        if (!response) {
          console.error(
            "API did not return a valid response for incorrect answer."
          );
        }
      }

      setTimeout(() => {
        setFeedback(null);
        if (isCorrect) {
          setCurrentAnswer("");
          setHintedOptions(null);
        }
        setIsSubmitting(false);

        if (isCorrect) {
          if (isTaskCompleted) {
            if (didLevelUp) {
              setShowLevelUpModal(true);
            } else {
              setIsFinished(true);
            }
          } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          }
        }
      }, 1500);
    } catch (error) {
      console.error("Błąd podczas wysyłania odpowiedzi:", error);
      if (
        error instanceof Error &&
        error.message?.includes("task already completed")
      ) {
        setIsFinished(true);
        console.warn(
          "Attempted to submit answer for an already completed task."
        );
      }
      setIsSubmitting(false);
    }
  };

  const handleCloseLevelUpModal = () => {
    setShowLevelUpModal(false);
    setIsFinished(true);
  };

  const stringsEqualFold = (a: string, b: string): boolean => {
    if (typeof a !== "string" || typeof b !== "string") {
      return false;
    }
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  };

  if (loading) {
    return <QuizLoadingSkeleton />;
  }

  if (!task) {
    return (
      <div className="p-8 text-center text-red-500">
        Błąd: Nie można załadować zadania. Sprawdź ID lub spróbuj ponownie.
      </div>
    );
  }

  const questions = task.task_questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={handleCloseLevelUpModal}
        newLevel={newLevel}
      />

      {isFinished ? (
        <QuizFinishedScreen task={task} isPracticeMode={isPracticeMode} />
      ) : currentQuestion ? (
        <QuizView
          task={task}
          currentQuestion={currentQuestion}
          optionsForCurrentQuestion={hintedOptions || currentQuestion.options}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progressPercent={
            questions.length > 0
              ? (currentQuestionIndex / questions.length) * 100
              : 0
          }
          isHintUsed={isHintUsed}
          feedback={feedback}
          isSubmitting={isSubmitting}
          currentAnswer={currentAnswer}
          handleUseHint={handleUseHint}
          handleCheckAnswer={handleCheckAnswer}
          setCurrentAnswer={setCurrentAnswer}
          isPracticeMode={isPracticeMode}
        />
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          To zadanie nie zawiera jeszcze żadnych pytań.
          <div className="mt-4">
            <Link href="/courses">
              <Button variant="outline">Wróć do listy zadań</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
