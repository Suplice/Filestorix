// Ścieżka pliku: app/courses/[id]/page.tsx

"use client";

// Importuj 'use' z React
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Importuj useAuth

import { Button } from "@/components/ui/button";
import { LevelUpModal } from "@/components/ui/quiz/levelUpModal";
import { QuizFinishedScreen } from "@/components/ui/quiz/quizFinishedScreen";
import { QuizLoadingSkeleton } from "@/components/ui/quiz/quizLoadingSkeleton";
import { QuizView } from "@/components/ui/quiz/quizView";
import { GetTaskByIdForUser, SubmitAnswerForTask } from "@/lib/api/task";
import { Task, UserAnswer } from "@/lib/types/task";
import { useParams, useSearchParams } from "next/navigation";

export default function CoursePage() {
  // ✅ Pobierz parametry bezpośrednio z routera Next.js
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id as string;
  const mode = searchParams.get("mode");
  const isPracticeMode = mode === "practice";

  const { user, setUser } = useAuth();

  // --- Stany ---
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

  // --- ZAKTUALIZOWANY EFEKT ŁADOWANIA ---
  useEffect(() => {
    // Czekaj na załadowanie użytkownika i ID
    if (!user || !id) {
      // Jeśli nie ma użytkownika, ale jest ID, możemy ustawić ładowanie na false,
      // aby uniknąć nieskończonego spinnera (AuthProvider powinien przekierować)
      if (id && !user) setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      // Resetuj stany quizu przy każdej zmianie ID, użytkownika lub trybu
      setCurrentQuestionIndex(0);
      setIsFinished(false);
      setHintedOptions(null);
      setIsHintUsed(false);
      setShowLevelUpModal(false); // Ukryj modal na wypadek nawigacji wstecz/dalej
      setTask(null); // Wyczyść stare zadanie na czas ładowania

      try {
        // Sprawdź czy ID jest poprawną liczbą
        const taskId = parseInt(id, 10);
        if (isNaN(taskId)) {
          console.error("Invalid task ID:", id);
          setLoading(false);
          // Można tu ustawić stan błędu do wyświetlenia
          return;
        }

        const data = await GetTaskByIdForUser(taskId, user.ID);

        if (data) {
          setTask(data); // Ustaw nowe zadanie
          const questions = data.task_questions || [];
          const progress = data.user_progress;

          // --- KLUCZOWA ZMIANA: Logika wznawiania ---
          if (progress) {
            // Jeśli ukończony I NIE jest to tryb treningowy -> pokaż ekran "Ukończono"
            if (progress.is_completed && !isPracticeMode) {
              setIsFinished(true);
            }
            // Jeśli NIE jest to tryb treningowy -> znajdź pierwsze niepoprawnie odpowiedziane pytanie
            else if (!isPracticeMode && !progress.is_completed) {
              // Dodano !progress.is_completed
              const answers = progress.answers || [];
              // Stwórz zbiór ID pytań, na które odpowiedziano POPRAWNIE
              const correctlyAnsweredIds = new Set(
                answers
                  .filter((a: UserAnswer) => a.is_correct)
                  .map((a: UserAnswer) => a.task_question_id)
              );

              // Znajdź indeks pierwszego pytania, którego ID NIE MA w zbiorze poprawnych
              let firstUnansweredIndex = -1;
              for (let i = 0; i < questions.length; i++) {
                // Sprawdź czy pytanie istnieje (na wypadek usunięcia pytania z zadania)
                if (
                  questions[i] &&
                  !correctlyAnsweredIds.has(questions[i].ID)
                ) {
                  firstUnansweredIndex = i;
                  break; // Znaleziono pierwsze nieodpowiedziane poprawnie
                }
              }

              if (firstUnansweredIndex !== -1) {
                // Ustaw indeks na znalezione pytanie
                setCurrentQuestionIndex(firstUnansweredIndex);
              } else if (questions.length > 0) {
                // Jeśli nie znaleziono (-1), a są pytania, to znaczy, że wszystkie są poprawnie odpowiedziane
                // Ustaw status na ukończony (nawet jeśli backend tego nie zwrócił - failsafe)
                setIsFinished(true);
              }
              // Jeśli nie ma pytań (questions.length === 0), isFinished pozostaje false
            }
            // Jeśli jest to tryb treningowy, currentQuestionIndex pozostaje 0
          }
          // Jeśli nie ma progresu (nowe zadanie dla usera), currentQuestionIndex pozostaje 0
        } else {
          console.error("Task data not received for ID:", taskId);
          // Można ustawić stan błędu
        }
      } catch (error) {
        console.error("Failed to fetch task details:", error);
        // Można ustawić stan błędu
      } finally {
        setLoading(false);
      }
    })();
    // Zależności useEffect - wykonaj ponownie, gdy zmieni się user, id lub tryb
  }, [user, id, isPracticeMode, setUser]); // Dodano setUser do zależności, aby uniknąć ostrzeżeń lintera

  // Logika podpowiedzi (bez zmian)
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

  // Logika sprawdzania odpowiedzi (bez zmian w stosunku do poprzedniej wersji)
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

    // --- LOGIKA DLA TRYBU TRENINGOWEGO ---
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

    // --- NORMALNA LOGIKA (gdy nie jest to tryb treningowy) ---
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
        // Jeśli odpowiedź jest niepoprawna, a backend zwrócił błąd (np. zadanie już ukończone), obsłuż to
        if (!response) {
          // Można tu dodać logikę sprawdzania statusu błędu z fetch, jeśli API go zwraca
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
        // Jeśli !isCorrect, nic nie rób
      }, 1500);
    } catch (error) {
      console.error("Błąd podczas wysyłania odpowiedzi:", error);
      // Sprawdź czy błąd zawiera informację z backendu
      // (zakładając, że backend zwraca błąd z `errors.New("task already completed")`)
      if (
        error instanceof Error &&
        error.message?.includes("task already completed")
      ) {
        setIsFinished(true); // Ustaw na ukończony, jeśli backend tak mówi
        console.warn(
          "Attempted to submit answer for an already completed task."
        );
      }
      setIsSubmitting(false);
    }
  };

  // Funkcja zamykania modala (bez zmian)
  const handleCloseLevelUpModal = () => {
    setShowLevelUpModal(false);
    setIsFinished(true);
  };

  // Funkcja pomocnicza (bez zmian)
  const stringsEqualFold = (a: string, b: string): boolean => {
    // Dodatkowe zabezpieczenie przed null/undefined
    if (typeof a !== "string" || typeof b !== "string") {
      return false;
    }
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  };

  // --- Renderowanie ---
  if (loading) {
    return <QuizLoadingSkeleton />;
  }

  // Jeśli nie ma zadania po załadowaniu (np. błąd API lub zły ID)
  if (!task) {
    return (
      <div className="p-8 text-center text-red-500">
        Błąd: Nie można załadować zadania. Sprawdź ID lub spróbuj ponownie.
      </div>
    );
  }

  const questions = task.task_questions || [];
  // Bezpieczne pobranie aktualnego pytania
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
      ) : currentQuestion ? ( // Sprawdź, czy currentQuestion istnieje
        <QuizView
          task={task}
          currentQuestion={currentQuestion}
          optionsForCurrentQuestion={hintedOptions || currentQuestion.options}
          currentQuestionIndex={currentQuestionIndex} // Przekaż aktualny indeks
          totalQuestions={questions.length}
          // Oblicz postęp na podstawie aktualnego indeksu
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
        // Ten widok pojawi się, jeśli zadanie istnieje, ale nie ma pytań
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
