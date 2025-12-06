import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Task } from "@/lib/types/task";
import { CheckCircle, Clock, Target, CircleAlert } from "lucide-react-native";
import { RNProgress, RNButton } from "@/components/nativeComponents";

type TaskItemProps = {
  task: Task;
  isMyTask?: boolean;
};

export function TaskItem({ task, isMyTask = true }: TaskItemProps) {
  const router = useRouter();

  const userProgress = task.user_progress;
  const progress = userProgress?.progress ?? 0;
  const isCompleted = userProgress?.is_completed ?? false;
  const attempts = userProgress?.attempts ?? 0;
  const mistakes = userProgress?.mistakes ?? 0;
  const hasStarted = !!userProgress;

  const difficultyColor =
    task.difficulty === "EASY"
      ? "#22c55e"
      : task.difficulty === "MEDIUM"
        ? "#eab308"
        : "#ef4444";

  const handlePress = () => {
    router.push({
      pathname: "/courses/[id]",
      params: { id: task.ID, mode: isCompleted ? "practice" : undefined },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          {isCompleted ? (
            <CheckCircle size={24} color="#22c55e" />
          ) : (
            <Clock size={24} color={hasStarted ? "#6366f1" : "#94a3b8"} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            {(isCompleted || hasStarted) && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isCompleted
                      ? "rgba(34, 197, 94, 0.1)"
                      : "rgba(99, 102, 241, 0.1)",
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: isCompleted ? "#22c55e" : "#818cf8",
                  }}
                >
                  {isCompleted ? "Completed" : "In Progress"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {hasStarted && (
        <View style={styles.progressRow}>
          <RNProgress
            value={progress}
            style={{ flex: 1, marginRight: 12, height: 8 }}
          />
          <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
        </View>
      )}

      <View style={styles.bottomRow}>
        <View>
          {hasStarted && !isCompleted && (
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 6 }}>
              <View style={styles.statItem}>
                <Target size={14} color="#94a3b8" />
                <Text style={styles.statText}>{attempts}</Text>
              </View>
              <View style={styles.statItem}>
                <CircleAlert size={14} color="#ef4444" />
                <Text style={[styles.statText, { color: "#ef4444" }]}>
                  {mistakes}
                </Text>
              </View>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={[styles.diffText, { color: difficultyColor }]}>
              {task.difficulty}
            </Text>
            <Text style={styles.metaText}>{task.language}</Text>
            <Text style={styles.xpText}>+{task.xp} XP</Text>
          </View>
        </View>

        {isMyTask && (
          <RNButton
            title={isCompleted ? "Retry" : hasStarted ? "Continue" : "Start"}
            size="sm"
            variant={hasStarted && !isCompleted ? "primary" : "outline"}
            onPress={handlePress}
            style={{
              height: 38,
              minWidth: 90,
              borderColor: "#334155",
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: { flexDirection: "row", marginBottom: 12 },
  iconContainer: { marginRight: 12, marginTop: 2 },
  title: { color: "#fff", fontSize: 17, fontWeight: "700" },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  progressText: { color: "#94a3b8", fontSize: 12, fontWeight: "600" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { color: "#94a3b8", fontSize: 12, fontWeight: "500" },
  diffText: { fontSize: 12, fontWeight: "bold" },
  metaText: { color: "#94a3b8", fontSize: 12 },
  xpText: { color: "#e2e8f0", fontSize: 12, fontWeight: "700" },
});
