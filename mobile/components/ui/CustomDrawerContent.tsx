import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function CustomDrawerContent(props: any) {
  const { user, handleLogout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "??";

  const xpStats = user ? getXpForNextLevel(user.level, user.xp) : null;

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const menuItems = [
    { label: "Home", icon: "home", route: "/(drawer)/home" },
    { label: "Courses", icon: "book", route: "/(drawer)/courses/page" },
    {
      label: "Leaderboard",
      icon: "award",
      route: "/(drawer)/leaderboard/page",
    },
    { label: "Friends", icon: "users", route: "/(drawer)/friends/page" },
    {
      label: "Profile",
      icon: "user",
      route: `/(drawer)/profile/${user?.ID}`,
    },
  ];

  const handleNavigation = (route: string) => {
    // @ts-ignore
    router.push(route);
  };

  const isRouteActive = (itemRoute: string) => {
    const cleanItemRoute = itemRoute.replace("/(drawer)", "");
    if (cleanItemRoute.includes("/profile")) {
      return pathname.includes("/profile");
    }
    if (itemRoute.includes("/(admin)")) {
      return pathname.startsWith("/(admin)");
    }
    return pathname.includes(cleanItemRoute);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.headerContainer}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {user?.avatarURL ? (
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

          <View style={styles.userDetails}>
            <Text style={styles.username} numberOfLines={1}>
              {user?.username || "Guest"}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </View>

        {user && xpStats && (
          <View style={styles.statsCard}>
            <View style={styles.statsTopRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={18} color="#f97316" />
                <Text style={styles.statText}>{user.streakCount || 0}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <FontAwesome5 name="coins" size={16} color="#f59e0b" />
                <Text style={styles.statText}>{user.points || 0}</Text>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.xpSection}>
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
          </View>
        )}
      </SafeAreaView>

      <ScrollView
        style={styles.menuContainer}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {menuItems.map((item, index) => {
          const isActive = isRouteActive(item.route);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigation(item.route)}
            >
              <Feather
                name={item.icon as any}
                size={22}
                color={isActive ? "#6366f1" : "#94a3b8"}
              />
              <Text
                style={[styles.menuText, isActive && styles.menuTextActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {isAdmin && (
          <>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={[
                styles.menuItem,
                isRouteActive("/(drawer)/admin/page") && styles.menuItemActive,
              ]}
              onPress={() => handleNavigation("/(drawer)/admin/page")}
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={22}
                color={
                  isRouteActive("/(drawer)/admin/page") ? "#6366f1" : "#ef4444"
                }
              />
              <Text
                style={[
                  styles.menuText,
                  isRouteActive("/(drawer)/admin/page") &&
                    styles.menuTextActive,
                  {
                    color: isRouteActive("/(drawer)/admin/page")
                      ? "#6366f1"
                      : "#ef4444",
                  },
                ]}
              >
                Admin Panel
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => console.log("Settings")}
        >
          <Feather name="settings" size={20} color="#94a3b8" />
          <Text style={styles.footerText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={[styles.footerText, { color: "#ef4444" }]}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  headerContainer: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#475569",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userDetails: {
    marginLeft: 14,
    flex: 1,
  },
  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    color: "#94a3b8",
    fontSize: 13,
  },

  statsCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statsTopRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#334155",
  },
  statText: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 15,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: "#334155",
    width: "100%",
    marginBottom: 10,
  },
  xpSection: {
    width: "100%",
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  levelLabel: {
    color: "#facc15",
    fontWeight: "700",
    fontSize: 13,
  },
  xpValues: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#0f172a",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 3,
  },

  menuContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  menuText: {
    color: "#94a3b8",
    marginLeft: 16,
    fontSize: 15,
    fontWeight: "500",
  },
  menuTextActive: {
    color: "#6366f1",
    fontWeight: "700",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    backgroundColor: "#0f172a",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  footerText: {
    color: "#94a3b8",
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
  },
});
