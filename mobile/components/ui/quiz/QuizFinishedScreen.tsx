import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Task } from "@/lib/types/task";
import { RNButton } from "@/components/nativeComponents";
import { CheckCircle, RotateCcw } from "lucide-react-native";
import { useRouter } from "expo-router";

export function QuizFinishedScreen({
  task,
  isPracticeMode,
}: {
  task: Task;
  isPracticeMode: boolean;
}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {isPracticeMode ? (
        <RotateCcw size={80} color="#3b82f6" style={{ marginBottom: 24 }} />
      ) : (
        <CheckCircle size={80} color="#22c55e" style={{ marginBottom: 24 }} />
      )}

      <Text style={styles.title}>
        {isPracticeMode ? "Practice Complete!" : "Task Complete!"}
      </Text>

      <Text style={styles.message}>
        {isPracticeMode
          ? "Great job practicing! Feel free to try again."
          : `Congratulations! You earned ${task.xp} XP and ${task.points} Points.`}
      </Text>

      <View style={{ width: "100%", gap: 12, marginTop: 40 }}>
        {/* Jeśli chcesz przeładować, w RN musisz zresetować stan w rodzicu, tu robimy prosty back */}
        <RNButton
          title="Back to Courses"
          onPress={() => router.push("/courses/page")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
  },
});
