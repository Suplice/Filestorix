import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useFocusEffect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { fetchUserProfile } from "@/lib/api/profile";
import { ProfileData } from "@/lib/types/profile";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { FriendshipButton } from "@/components/ui/profile/FriendshipButton";
import { StatCard } from "@/components/ui/profile/StatCard";
import { TaskItem } from "@/components/ui/tasks/TaskItem";

const xpThresholds: { [key: number]: number } = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 4000,
};

const getXpForNextLevel = (currentLevel: number, currentXp: number) => {
  let xpForCurrentLevel = xpThresholds[currentLevel] ?? 0;
  let nextLevel: number | null = currentLevel + 1;
  let xpForNextLevel = xpThresholds[nextLevel];

  if (xpForNextLevel === undefined) {
    nextLevel = null;
    xpForNextLevel = currentXp;
    if (xpForCurrentLevel > currentXp) xpForCurrentLevel = currentXp;
  }

  const xpInCurrentLevel = Math.max(0, currentXp - xpForCurrentLevel);
  const levelXpRange = Math.max(1, xpForNextLevel - xpForCurrentLevel);

  const progressPercentage = Math.min(
    100,
    Math.max(0, (xpInCurrentLevel / levelXpRange) * 100)
  );

  return {
    xpInCurrentLevel,
    levelXpRange,
    progressPercentage,
    nextLevel,
  };
};

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const profileId = Array.isArray(id)
    ? parseInt(id[0], 10)
    : parseInt(id as string, 10);
  const isOwnProfile = currentUser?.ID === profileId;

  const loadProfile = useCallback(async () => {
    if (isNaN(profileId)) {
      setLoading(false);
      return;
    }
    if (!profileData) setLoading(true);

    try {
      const data = await fetchUserProfile(profileId);
      setProfileData(data);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profileId]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfile();
  }, [loadProfile]);

  if (loading && !profileData) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>User not found.</Text>
      </View>
    );
  }

  const {
    user,
    totalCompleted,
    totalMistakes,
    tasksWithProgress,
    friendshipWithView,
  } = profileData;

  const userInitials = user.username?.substring(0, 2).toUpperCase() || "??";
  const xpStats = getXpForNextLevel(user.level, user.xp);

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
      <Stack.Screen
        options={{
          title: user.username || "Profile",
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          {user.avatarURL ? (
            <Image
              source={{ uri: user.avatarURL }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <AntDesign name="star" size={14} color="#facc15" />
              <Text style={styles.levelLabel}>Level {user.level}</Text>
            </View>
            <Text style={styles.xpValues}>
              {xpStats.nextLevel
                ? `${Math.floor(xpStats.xpInCurrentLevel)} / ${xpStats.levelXpRange} XP`
                : "Max Level"}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${xpStats.progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        {!isOwnProfile && friendshipWithView && (
          <View style={styles.actionButtonContainer}>
            <FriendshipButton
              profileUserId={user.ID}
              friendshipStatus={friendshipWithView}
              onActionComplete={loadProfile}
            />
          </View>
        )}
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Level"
          value={user.level}
          icon={<AntDesign name="star" size={20} color="#facc15" />}
        />
        <StatCard
          title="Points"
          value={user.points}
          icon={<FontAwesome5 name="coins" size={16} color="#f59e0b" />}
        />
        <StatCard
          title="Streak"
          value={`${user.streakCount}d`}
          icon={
            <MaterialCommunityIcons name="fire" size={20} color="#f97316" />
          }
        />
        <StatCard
          title="Completed"
          value={totalCompleted}
          icon={<Feather name="check-square" size={20} color="#22c55e" />}
        />
        <StatCard
          title="Mistakes"
          value={totalMistakes}
          icon={<Feather name="alert-circle" size={20} color="#ef4444" />}
        />
      </View>

      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>Task Progress</Text>

        {tasksWithProgress && tasksWithProgress.length > 0 ? (
          <View style={styles.taskList}>
            {tasksWithProgress
              .filter((task) => task.user_progress)
              .map((task) => (
                <TaskItem key={task.ID} task={task} isMyTask={isOwnProfile} />
              ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {user.username} hasn&apos;t started any tasks yet.
            </Text>
          </View>
        )}
      </View>
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
  errorText: {
    color: "#ef4444",
    fontSize: 18,
  },
  headerCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#334155",
    overflow: "hidden",
    marginBottom: 16,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#94a3b8",
  },

  xpContainer: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelLabel: {
    color: "#facc15",
    fontWeight: "700",
    fontSize: 14,
  },
  xpValues: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#0f172a",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  actionButtonContainer: {
    width: "100%",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  tasksSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  taskList: {
    gap: 12,
  },
  emptyState: {
    padding: 32,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    alignItems: "center",
  },
  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
  },
});
