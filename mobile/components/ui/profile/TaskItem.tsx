import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Task } from "@/lib/types/task";

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

  // Sprawdzamy czy zadanie zostało rozpoczęte
  const hasStarted = !!userProgress;

  // Kolory trudności
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY":
        return "#22c55e"; // Green-500
      case "MEDIUM":
        return "#eab308"; // Yellow-500
      case "HARD":
        return "#ef4444"; // Red-500
      default:
        return "#94a3b8"; // Slate-400
    }
  };

  const handlePress = () => {
    if (!isMyTask) return;

    // Nawigacja
    router.push({
      pathname: "/courses/[id]",
      params: { id: task.ID, mode: isCompleted ? "practice" : undefined },
    });
  };

  return (
    <View style={styles.container}>
      {/* Lewa strona: Ikona i Info */}
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          {isCompleted ? (
            <Feather name="check-circle" size={24} color="#22c55e" />
          ) : (
            // Kolor ikony: Indigo jeśli w trakcie, szary jeśli nie
            <Feather
              name="clock"
              size={24}
              color={hasStarted ? "#6366f1" : "#94a3b8"}
            />
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {task.title}
            </Text>

            {/* Badge Statusu */}
            {(isCompleted || hasStarted) && (
              <View
                style={[
                  styles.badge,
                  isCompleted ? styles.badgeSuccess : styles.badgeProgress,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isCompleted ? "#22c55e" : "#818cf8" },
                  ]}
                >
                  {isCompleted ? "Completed" : "In Progress"}
                </Text>
              </View>
            )}
          </View>

          {/* Pasek postępu - Wyświetlaj tylko jeśli rozpoczęto */}
          {hasStarted && (
            <View style={styles.progressRow}>
              <View style={styles.progressBarBg}>
                <View
                  style={[styles.progressBarFill, { width: `${progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
            </View>
          )}

          {/* Statystyki Prób */}
          {hasStarted && attempts > 0 && !isCompleted && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="target"
                  size={14}
                  color="#94a3b8"
                />
                <Text style={styles.statText}>{attempts}</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="alert-circle" size={14} color="#ef4444" />
                <Text style={[styles.statText, { color: "#ef4444" }]}>
                  {mistakes}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Prawa strona: Meta dane i przycisk */}
      <View style={styles.rightContent}>
        <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
          <Text
            style={[
              styles.difficulty,
              { color: getDifficultyColor(task.difficulty) },
            ]}
          >
            {task.difficulty}
          </Text>
          <Text style={styles.metaText}>{task.language}</Text>
          <Text style={styles.xpText}>+{task.xp} XP</Text>
        </View>

        {isMyTask && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              // Jeśli "Continue" (nieukończone, ale zaczęte) dajemy primary style, w przeciwnym razie outline
              hasStarted && !isCompleted
                ? styles.actionButtonPrimary
                : styles.actionButtonOutline,
            ]}
            onPress={handlePress}
          >
            <Text
              style={[
                styles.actionButtonText,
                hasStarted && !isCompleted
                  ? { color: "#fff" }
                  : { color: "#fff" },
              ]}
            >
              {isCompleted ? "Retry" : hasStarted ? "Continue" : "Start"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b", // Dark Card BG
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155", // Slate Border
  },
  leftContent: {
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 6,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff", // White text
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeSuccess: {
    backgroundColor: "rgba(34, 197, 94, 0.15)", // Green background alpha
  },
  badgeProgress: {
    backgroundColor: "rgba(99, 102, 241, 0.15)", // Indigo background alpha
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#334155", // Slate-700
    borderRadius: 3,
    overflow: "hidden",
    maxWidth: 100,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366f1", // Indigo-500
  },
  progressText: {
    fontSize: 12,
    color: "#94a3b8", // Muted text
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },

  // Right Content
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  difficulty: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 2,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  // Przyciski
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  actionButtonOutline: {
    borderColor: "#334155",
    backgroundColor: "transparent",
  },
  actionButtonPrimary: {
    borderColor: "#4f46e5",
    backgroundColor: "#4f46e5",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
});
