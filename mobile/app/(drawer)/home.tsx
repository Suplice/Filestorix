import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";

import { fetchIncomingRequests } from "@/lib/api/friends";
import { fetchLeaderboard } from "@/lib/api/leaderboard";
import { GetAllTasksForUser } from "@/lib/api/task";
import { FriendshipInfo } from "@/lib/types/user";
import { LeaderboardEntry } from "@/lib/types/leaderboard";
import { Task } from "@/lib/types/task";

const StatCard = ({ title, value, icon, color }: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {icon}
    </View>
    <View style={styles.cardContent}>
      <Text style={[styles.cardValue, { color: color || "white" }]}>
        {value}
      </Text>
    </View>
  </View>
);

const FriendRequestsWidget = ({
  requests,
  isLoading,
  onActionComplete,
}: any) => {
  const router = useRouter();

  return (
    <View style={styles.widgetCard}>
      <View style={styles.widgetHeader}>
        <View style={styles.widgetTitleContainer}>
          <Feather name="users" size={20} color="#e2e8f0" />
          <Text style={styles.widgetTitle}>Friend Requests</Text>
        </View>
      </View>

      <View style={styles.widgetContent}>
        {isLoading ? (
          <ActivityIndicator color="#6366f1" />
        ) : requests.length === 0 ? (
          <Text style={styles.emptyText}>No new requests.</Text>
        ) : (
          requests.map((req: FriendshipInfo) => (
            <View key={req.ID} style={styles.listItem}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                }}
              >
                <View style={styles.avatarPlaceholder}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {req.otherUser.username.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.listItemText}>
                  {req.otherUser.username}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(drawer)/friends/page")}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={styles.widgetFooter}
        onPress={() => router.push("/(drawer)/friends/page")}
      >
        <Text style={styles.footerLink}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

const LeaderboardWidget = ({ topEntries, currentUser, isLoading }: any) => {
  const router = useRouter();
  const displayEntries = topEntries.slice(0, 3);

  return (
    <View style={styles.widgetCard}>
      <View style={styles.widgetHeader}>
        <View style={styles.widgetTitleContainer}>
          <AntDesign name="trophy" size={20} color="#eab308" />
          <Text style={styles.widgetTitle}>Top Friends (Level)</Text>
        </View>
      </View>

      <View style={styles.widgetContent}>
        {isLoading ? (
          <ActivityIndicator color="#6366f1" />
        ) : displayEntries.length === 0 ? (
          <Text style={styles.emptyText}>No friends data available.</Text>
        ) : (
          displayEntries.map((entry: LeaderboardEntry, index: number) => {
            const isMe = entry.user.ID === currentUser?.ID;
            return (
              <View
                key={entry.user.ID}
                style={[styles.listItem, isMe && styles.listItemHighlight]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    style={[
                      styles.rankText,
                      index === 0 && { color: "#eab308" },
                    ]}
                  >
                    #{index + 1}
                  </Text>
                  <Text
                    style={[
                      styles.listItemText,
                      isMe && { fontWeight: "bold", color: "#6366f1" },
                    ]}
                  >
                    {entry.user.username}
                  </Text>
                </View>
                <Text style={styles.statValue}>Lvl {entry.user.level}</Text>
              </View>
            );
          })
        )}
      </View>

      <TouchableOpacity
        style={styles.widgetFooter}
        onPress={() => router.push("/(drawer)/leaderboard/page")}
      >
        <Text style={styles.footerLink}>View Full Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const ContinueLearningCard = ({ task }: { task: Task | null }) => {
  const router = useRouter();

  if (!task) return null;

  return (
    <View
      style={[styles.widgetCard, { borderColor: "#6366f1", borderWidth: 1 }]}
    >
      <View style={styles.widgetHeader}>
        <Text style={styles.widgetTitle}>Continue Learning</Text>
      </View>
      <View style={styles.widgetContent}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDesc} numberOfLines={2}>
          {task.description}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/(drawer)/courses/page")}
        >
          <Text style={styles.primaryButtonText}>Resume Task</Text>
          <Feather name="arrow-right" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { user: currentUser, isAuthenticated } = useAuth();
  const router = useRouter();

  const [incomingRequests, setIncomingRequests] = useState<FriendshipInfo[]>(
    []
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!currentUser) return;

    try {
      const results = await Promise.allSettled([
        fetchIncomingRequests(),
        fetchLeaderboard("level", "friends"),
        GetAllTasksForUser(currentUser.ID),
      ]);

      if (results[0].status === "fulfilled" && results[0].value) {
        setIncomingRequests(results[0].value);
      } else {
        setIncomingRequests([]);
      }

      if (results[1].status === "fulfilled" && results[1].value) {
        setLeaderboard(results[1].value);
      } else {
        setLeaderboard([]);
      }

      if (results[2].status === "fulfilled" && results[2].value) {
        setUserTasks(results[2].value);
      } else {
        setUserTasks([]);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadDashboardData();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const taskToContinue = userTasks.find(
    (task) => task.user_progress && !task.user_progress.is_completed
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>Please log in.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#6366f1"
        />
      }
    >
      <View style={styles.headerSection}>
        <Text style={styles.greeting}>
          Welcome back, {currentUser.username}!
        </Text>
        <Text style={styles.subGreeting}>
          Here&apos;s your progress overview.
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statWrapper}>
          <StatCard
            title="Level"
            value={currentUser.level}
            icon={<AntDesign name="star" size={18} color="#facc15" />}
            color="#facc15"
          />
        </View>
        <View style={styles.statWrapper}>
          <StatCard
            title="Points"
            value={currentUser.points}
            icon={<FontAwesome5 name="coins" size={16} color="#f59e0b" />}
            color="#f59e0b"
          />
        </View>
        <View style={styles.statWrapper}>
          <StatCard
            title="Streak"
            value={`${currentUser.streakCount}d`}
            icon={
              <MaterialCommunityIcons name="fire" size={20} color="#f97316" />
            }
            color="#f97316"
          />
        </View>
      </View>

      {taskToContinue && (
        <View style={styles.section}>
          <ContinueLearningCard task={taskToContinue} />
        </View>
      )}

      <View style={styles.widgetsContainer}>
        <View style={styles.widgetWrapper}>
          <FriendRequestsWidget
            requests={incomingRequests}
            isLoading={loading}
            onActionComplete={loadDashboardData}
          />
        </View>

        <View style={styles.widgetWrapper}>
          <LeaderboardWidget
            topEntries={leaderboard}
            currentUser={currentUser}
            isLoading={loading}
          />
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: "#94a3b8",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  statWrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardContent: {
    alignItems: "flex-start",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  section: {
    marginBottom: 24,
  },
  widgetsContainer: {
    gap: 24,
  },
  widgetWrapper: {
    width: "100%",
  },
  widgetCard: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    overflow: "hidden",
  },
  widgetHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    backgroundColor: "#1e293b",
  },
  widgetTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  widgetContent: {
    padding: 16,
  },
  widgetFooter: {
    padding: 12,
    backgroundColor: "#1e293b",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  footerLink: {
    color: "#818cf8",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  listItemHighlight: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  listItemText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  rankText: {
    color: "#94a3b8",
    fontWeight: "bold",
    width: 24,
  },
  statValue: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
  },
  smallButton: {
    backgroundColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  taskTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  taskDesc: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
