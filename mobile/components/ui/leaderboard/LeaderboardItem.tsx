import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LeaderboardEntry } from "@/lib/types/leaderboard";
import { User } from "@/lib/types/user";
import { RNAvatar } from "@/components/nativeComponents";
import { Medal, Star, Coins, CheckSquare } from "lucide-react-native";
import { useRouter } from "expo-router";

type LeaderboardItemProps = {
  entry: LeaderboardEntry;
  currentUser: User | null;
  criteria: "level" | "points" | "completed";
};

export function LeaderboardItem({
  entry,
  currentUser,
  criteria,
}: LeaderboardItemProps) {
  const router = useRouter();
  const isCurrentUser = currentUser?.ID === entry.user.ID;
  const fallbackName =
    entry.user.username?.substring(0, 2).toUpperCase() ?? "?";

  // Określenie, co wyświetlamy jako wartość (Level, Punkty czy Kursy)
  let ValueIcon;
  let valueColor;
  let displayValue = entry.value;

  switch (criteria) {
    case "level":
      ValueIcon = Star;
      valueColor = "#facc15"; // Yellow-400
      break;
    case "points":
      ValueIcon = Coins;
      valueColor = "#f59e0b"; // Amber-500
      break;
    case "completed":
      ValueIcon = CheckSquare;
      valueColor = "#3b82f6"; // Blue-500
      displayValue = entry.completedCourses ?? entry.value;
      break;
    default:
      ValueIcon = Star;
      valueColor = "#ffffff";
  }

  const handlePress = () => {
    router.push({
      pathname: "/profile/[id]",
      params: { id: entry.user.ID },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        isCurrentUser && styles.currentUserContainer, // Wyróżnienie zalogowanego usera
      ]}
    >
      <View style={styles.leftSide}>
        {/* Rank / Medal */}
        <View style={styles.rankContainer}>
          {entry.rank === 1 ? (
            <Medal size={24} color="#eab308" /> // Gold
          ) : entry.rank === 2 ? (
            <Medal size={24} color="#94a3b8" /> // Silver/Slate
          ) : entry.rank === 3 ? (
            <Medal size={24} color="#a16207" /> // Bronze
          ) : (
            <Text style={styles.rankText}>{entry.rank}</Text>
          )}
        </View>

        {/* Avatar i Nazwa */}
        <RNAvatar
          src={entry.user.avatarURL}
          fallback={fallbackName}
          size={40}
        />
        <View style={styles.userInfo}>
          <Text
            style={[styles.username, isCurrentUser && styles.currentUserText]}
            numberOfLines={1}
          >
            {entry.user.username} {isCurrentUser && "(You)"}
          </Text>
        </View>
      </View>

      {/* Wartość po prawej */}
      <View style={styles.valueContainer}>
        <ValueIcon size={16} color={valueColor} style={{ marginRight: 6 }} />
        <Text style={styles.valueText}>{displayValue}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155", // Slate border
    backgroundColor: "transparent",
  },
  currentUserContainer: {
    backgroundColor: "rgba(99, 102, 241, 0.15)", // Indigo z przezroczystością
    borderColor: "rgba(99, 102, 241, 0.3)",
    borderWidth: 1,
    borderRadius: 8,
    borderBottomWidth: 1, // Reset borderu dolnego wewnątrz kontenera
    marginVertical: 2, // Mały odstęp żeby border był widoczny
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rankContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8", // Muted text
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
  currentUserText: {
    fontWeight: "700",
    color: "#818cf8", // Indigo-400
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 60,
    justifyContent: "flex-end",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
});
