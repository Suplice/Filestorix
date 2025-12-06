import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Task, TaskQuestion } from "@/lib/types/task";
import { RNButton, RNProgress } from "@/components/nativeComponents";
import { Lightbulb, Info, CheckCircle, XCircle } from "lucide-react-native";
import { QuestionRenderer } from "./QuestionRenderer";
import { useRouter } from "expo-router";

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
  const router = useRouter();

  let containerStyle = styles.card;
  if (feedback === "correct")
    containerStyle = {
      ...styles.card,
      borderColor: "#22c55e",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
    };
  if (feedback === "incorrect")
    containerStyle = {
      ...styles.card,
      borderColor: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.subtitle}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Text>
        <RNProgress value={progressPercent} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <RNButton
          title={isHintUsed ? "Hint Used" : "Hint (1)"}
          icon={
            <Lightbulb
              size={16}
              color={isHintUsed ? "#94a3b8" : "#fff"}
              style={{ marginRight: 6 }}
            />
          }
          size="sm"
          variant={isHintUsed ? "ghost" : "secondary"}
          onPress={handleUseHint}
          disabled={isHintUsed}
        />
      </View>

      {isPracticeMode && (
        <View style={styles.practiceBanner}>
          <Info size={16} color="#60a5fa" />
          <Text style={styles.practiceText}>Training mode: No XP/Points.</Text>
        </View>
      )}

      {/* Pytanie */}
      <View style={containerStyle}>
        <QuestionRenderer
          question={currentQuestion}
          options={optionsForCurrentQuestion}
          answer={currentAnswer}
          onAnswerChange={setCurrentAnswer}
          disabled={isSubmitting}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <RNButton
          title="Leave"
          variant="outline"
          onPress={() => router.push("/(drawer)/courses/page")}
          style={{ borderColor: "#ef4444", minWidth: 80 }}
        />

        {feedback === "correct" && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CheckCircle size={20} color="#22c55e" />
            <Text style={{ color: "#22c55e", fontWeight: "bold" }}>
              Correct!
            </Text>
          </View>
        )}

        {feedback === "incorrect" && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <XCircle size={20} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Wrong!</Text>
          </View>
        )}

        {!feedback && (
          <RNButton
            title={isSubmitting ? "Checking..." : "Check"}
            onPress={handleCheckAnswer}
            loading={isSubmitting}
            disabled={!currentAnswer}
            style={{ minWidth: 100 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  subtitle: { color: "#94a3b8", marginBottom: 12 },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 20,
  },
  practiceBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
    borderColor: "#3b82f6",
    borderWidth: 1,
  },
  practiceText: { color: "#60a5fa", fontSize: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
});
