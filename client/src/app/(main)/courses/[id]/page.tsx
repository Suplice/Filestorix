// Ścieżka pliku: app/courses/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Importuj useAuth
import { GetTaskByIdForUser, SubmitAnswerForTask } from "@/lib/api/task";
import { LevelUpModal } from "@/components/ui/quiz/levelUpModal";
import { QuizFinishedScreen } from "@/components/ui/quiz/quizFinishedScreen";
import { QuizView } from "@/components/ui/quiz/quizView";
import { QuizLoadingSkeleton } from "@/components/ui/quiz/quizLoadingSkeleton";
import { Task } from "@/lib/types/task";

// Importy komponentów-widoków

type CoursePageProps = {
  params: {
    id: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  const { id } = params;
  // Pobierz 'user' i 'setUser' z kontekstu
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

  // --- NOWE STANY DLA MODALA ---
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  // --- Efekt do pobierania danych ---
  useEffect(() => {
    if (!user || !id) return;

    (async () => {
      setLoading(true);
      try {
        const taskId = parseInt(id, 10);
        const data = await GetTaskByIdForUser(taskId, user.ID);

        if (data) {
          setTask(data);
          const questions = data.task_questions || [];
          const progress = data.user_progress;

          if (progress) {
            if (progress.is_completed) {
              setIsFinished(true);
            } else {
              // Zacznij od pytania, na którym użytkownik skończył
              const answeredCount = progress.answers?.length || 0;
              if (answeredCount < questions.length) {
                setCurrentQuestionIndex(answeredCount);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch task details:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id]); // Zależność od user i id

  // --- Logika podpowiedzi ---
  const handleUseHint = () => {
    if (isHintUsed || !task) return;

    setIsHintUsed(true); // Użyj podpowiedzi - zablokuj na resztę zadania
    const questions = task.task_questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct_answer;

    if (currentQuestion.type === "QUIZ") {
      // Znajdź pierwszą niepoprawną odpowiedź do usunięcia
      const incorrectOptionToRemove = currentQuestion.options.find(
        (opt) => opt !== correctAnswer
      );

      if (incorrectOptionToRemove) {
        // Ustaw nową listę opcji bez tej jednej niepoprawnej
        setHintedOptions(
          currentQuestion.options.filter(
            (opt) => opt !== incorrectOptionToRemove
          )
        );
      }
    } else if (currentQuestion.type === "FILL_BLANK") {
      if (correctAnswer && correctAnswer.length > 0) {
        // Ustaw input na pierwszą literę poprawnej odpowiedzi
        setCurrentAnswer(correctAnswer.charAt(0));
      }
    }
  };

  // --- Logika sprawdzania odpowiedzi (z obsługą level-up) ---
  const handleCheckAnswer = async () => {
    if (isSubmitting || !task || !user || !currentAnswer) return;

    const questions = task.task_questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const oldLevel = user.level; // Zapisz stary poziom PRZED wysłaniem

    setIsSubmitting(true);
    try {
      const response = await SubmitAnswerForTask(
        task.ID,
        currentQuestion.ID,
        currentAnswer
      );

      let didLevelUp = false;
      const totalQuestions = questions.length; // Pobierz liczbę pytań

      if (response && response.is_correct) {
        setFeedback("correct");

        // Sprawdź, czy backend zwrócił zaktualizowanego usera
        if (response.is_completed && response.updated_user) {
          const newUser = response.updated_user;

          // 1. Zaktualizuj globalny stan użytkownika (to zaktualizuje AppTopbar)
          setUser(newUser);

          // 2. Sprawdź, czy był awans
          if (newUser.level > oldLevel) {
            didLevelUp = true;
            setNewLevel(newUser.level);
          }
        }
      } else {
        setFeedback("incorrect");
      }

      // Logika po otrzymaniu odpowiedzi (w setTimeout)
      setTimeout(() => {
        setFeedback(null);
        setCurrentAnswer(""); // Wyczyść pole odpowiedzi
        setIsSubmitting(false);

        // Przejdź dalej tylko jeśli odpowiedź była poprawna
        if (response && response.is_correct) {
          setHintedOptions(null); // Resetuj podpowiedzi dla nowego pytania
          const isLastQuestion = currentQuestionIndex + 1 >= totalQuestions;

          if (isLastQuestion) {
            if (didLevelUp) {
              // Awans! Pokaż modal. Modal sam ustawi isFinished po zamknięciu.
              setShowLevelUpModal(true);
            } else {
              // Koniec, ale bez awansu. Pokaż ekran końcowy.
              setIsFinished(true);
            }
          } else {
            // Przejdź do następnego pytania
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          }
        }
        // Jeśli odpowiedź była niepoprawna, po prostu odblokuj przycisk (isSubmitting = false)
      }, 1500); // 1.5 sekundy na feedback
    } catch (error) {
      console.error("Błąd podczas wysyłania odpowiedzi:", error);
      setIsSubmitting(false);
    }
  };

  // --- Funkcja: Zamykanie modala ---
  const handleCloseLevelUpModal = () => {
    setShowLevelUpModal(false);
    setIsFinished(true); // Dopiero po zamknięciu modala pokaż ekran "Ukończono"
  };

  // --- Renderowanie ---

  if (loading) {
    return <QuizLoadingSkeleton />;
  }

  if (!task) {
    return <div className="p-8">Błąd: Nie znaleziono zadania.</div>;
  }

  // Pobierz pytania raz, aby uniknąć błędów
  const questions = task.task_questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // --- RENDERUJEMY MODAL (zawsze, ale będzie ukryty) ---
  return (
    <>
      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={handleCloseLevelUpModal}
        newLevel={newLevel}
      />

      {/* Reszta logiki renderowania (ekran końcowy lub quiz) */}
      {isFinished ? (
        <QuizFinishedScreen task={task} />
      ) : currentQuestion ? ( // Sprawdź, czy currentQuestion istnieje
        <QuizView
          task={task}
          currentQuestion={currentQuestion}
          optionsForCurrentQuestion={hintedOptions || currentQuestion.options}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progressPercent={(currentQuestionIndex / questions.length) * 100}
          isHintUsed={isHintUsed}
          feedback={feedback}
          isSubmitting={isSubmitting}
          currentAnswer={currentAnswer}
          handleUseHint={handleUseHint}
          handleCheckAnswer={handleCheckAnswer}
          setCurrentAnswer={setCurrentAnswer}
        />
      ) : (
        // Fallback, jeśli zadanie nie ma pytań lub indeks jest błędny
        <div className="p-8">
          Błąd: Nie można załadować pytań dla tego zadania.
        </div>
      )}
    </>
  );
}
