import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { fetchLeaderboard } from "@/lib/api/leaderboard";
import {
  LeaderboardEntry,
  LeaderboardCriteria,
  LeaderboardFilter,
} from "@/lib/types/leaderboard";
import { RNSkeleton } from "@/components/nativeComponents";
import { Square, CheckSquare } from "lucide-react-native";
import { LeaderboardItem } from "@/components/ui/leaderboard/LeaderboardItem";

export default function LeaderboardScreen() {
  const { user: currentUser } = useAuth();

  // Stany
  const [activeTab, setActiveTab] = useState<LeaderboardCriteria>("level");
  const [filter, setFilter] = useState<LeaderboardFilter>("all");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Funkcja pobierająca dane
  const loadLeaderboardData = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const data = await fetchLeaderboard(activeTab, filter);
      if (data) {
        setLeaderboardData(data);
      } else {
        // Obsługa błędu cicha lub toast, tutaj Alert dla RN
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error("Leaderboard fetch error:", error);
      Alert.alert("Error", "Failed to load leaderboard.");
      setLeaderboardData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, filter, currentUser]);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboardData();
  };

  const toggleFilter = () => {
    setFilter((prev) => (prev === "all" ? "friends" : "all"));
  };

  // Komponent pomocniczy dla Tabów
  const TabButton = ({
    title,
    value,
  }: {
    title: string;
    value: LeaderboardCriteria;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === value && styles.activeTabButton]}
      onPress={() => setActiveTab(value)}
      disabled={loading}
    >
      <Text
        style={[styles.tabText, activeTab === value && styles.activeTabText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>

        {/* Filter Switch (Friends Only) */}
        <TouchableOpacity
          style={styles.filterContainer}
          onPress={toggleFilter}
          disabled={loading || !currentUser}
        >
          {filter === "friends" ? (
            <CheckSquare size={20} color="#6366f1" /> // Checked: Indigo
          ) : (
            <Square size={20} color="#94a3b8" /> // Unchecked: Slate
          )}
          <Text style={styles.filterText}>Friends Only</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton title="Level" value="level" />
        <TabButton title="Points" value="points" />
        <TabButton title="Courses" value="completed" />
      </View>

      {/* Content List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <RNSkeleton
                key={i}
                style={{ width: "100%", height: 64, marginBottom: 12 }}
              />
            ))}
          </View>
        ) : leaderboardData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No data available for this view.
            </Text>
            {filter === "friends" && (
              <Text style={styles.emptySubText}>Try viewing all users.</Text>
            )}
          </View>
        ) : (
          <View style={styles.listCard}>
            {leaderboardData.map((entry) => (
              <LeaderboardItem
                key={entry.user.ID}
                entry={entry}
                currentUser={currentUser}
                criteria={activeTab}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617", // Main Dark BG
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterText: {
    color: "#e2e8f0", // Light text
    fontSize: 14,
    fontWeight: "500",
  },
  // Tabs Styles
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#1e293b", // Card BG
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#334155",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "#6366f1", // Indigo Accent
  },
  tabText: {
    color: "#94a3b8", // Muted text
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  // Content Styles
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    marginTop: 10,
  },
  listCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden", // Żeby dzieci nie wychodziły poza border radius
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "500",
  },
  emptySubText: {
    color: "#64748b",
    marginTop: 4,
    fontSize: 14,
  },
});
