import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { GetTaskByIdForUser, SubmitAnswerForTask } from "@/lib/api/task";
import { Task, UserAnswer } from "@/lib/types/task";
import {
  RNButton,
  RNSkeleton,
  RNProgress,
} from "@/components/nativeComponents";
import { LevelUpModal } from "@/components/ui/quiz/LevelUpModal";
import { QuizFinishedScreen } from "@/components/ui/quiz/QuizFinishedScreen";
import { QuizView } from "@/components/ui/quiz/QuizView";

export default function CourseScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const mode = params.mode as string;
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
    if (!user || !id) return;

    (async () => {
      setLoading(true);
      setCurrentQuestionIndex(0);
      setIsFinished(false);
      setHintedOptions(null);
      setIsHintUsed(false);

      try {
        const taskId = parseInt(id, 10);
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
        }
      } catch (error) {
        console.error("Failed to fetch task:", error);
        Alert.alert("Error", "Could not load task.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id, isPracticeMode]);

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
      isCorrect =
        currentAnswer.trim().toLowerCase() ===
        correctAnswer.trim().toLowerCase();
      setFeedback(isCorrect ? "correct" : "incorrect");
      if (isCorrect)
        isTaskCompleted = currentQuestionIndex + 1 >= totalQuestions;

      setTimeout(() => {
        setFeedback(null);
        if (isCorrect) {
          setCurrentAnswer("");
          setHintedOptions(null);
          if (isTaskCompleted) setIsFinished(true);
          else setCurrentQuestionIndex((prev) => prev + 1);
        }
        setIsSubmitting(false);
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
      }

      setTimeout(() => {
        setFeedback(null);
        if (isCorrect) {
          setCurrentAnswer("");
          setHintedOptions(null);
          if (isTaskCompleted) {
            if (didLevelUp) setShowLevelUpModal(true);
            else setIsFinished(true);
          } else {
            setCurrentQuestionIndex((prev) => prev + 1);
          }
        }
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#6366f1"
          style={{ marginTop: 50 }}
        />
      </View>
    );
  }

  if (!task)
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Task not found
        </Text>
      </View>
    );

  const questions = task.task_questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Stack.Screen
        options={{
          title: task ? task.title : "Zadanie",
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => {
            setShowLevelUpModal(false);
            setIsFinished(true);
          }}
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
            isPracticeMode={isPracticeMode}
            isSubmitting={isSubmitting}
            currentAnswer={currentAnswer}
            handleUseHint={handleUseHint}
            handleCheckAnswer={handleCheckAnswer}
            setCurrentAnswer={setCurrentAnswer}
          />
        ) : (
          <Text
            style={{ color: "#94a3b8", textAlign: "center", marginTop: 50 }}
          >
            No questions available.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  scrollContainer: { flexGrow: 1, backgroundColor: "#020617" },
});
