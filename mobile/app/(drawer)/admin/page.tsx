import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchSystemStats, SystemStats } from "@/lib/api/admin";
import { Users, CheckSquare, Layers, ArrowLeft } from "lucide-react-native";
import { RNButton, RNSkeleton } from "@/components/nativeComponents";

const StatCard = ({ title, value, icon, color = "#94a3b8" }: any) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <Text style={styles.statTitle}>{title}</Text>
      {icon}
    </View>
    <Text style={[styles.statValue, { color: "#fff" }]}>{value}</Text>
  </View>
);

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSystemStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(drawer)/home")}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Manage your users, tasks, and view system statistics.
        </Text>

        <View style={styles.statsGrid}>
          {loading ? (
            <>
              <RNSkeleton style={{ flex: 1, height: 100 }} />
              <RNSkeleton style={{ flex: 1, height: 100 }} />
            </>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={stats?.total_users ?? 0}
                icon={<Users size={20} color="#94a3b8" />}
              />
              <StatCard
                title="Total Tasks"
                value={stats?.total_tasks ?? 0}
                icon={<Layers size={20} color="#94a3b8" />}
              />
              <StatCard
                title="Completed"
                value={stats?.total_completed_tasks ?? 0}
                icon={<CheckSquare size={20} color="#94a3b8" />}
              />
            </>
          )}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.card}>
          <View style={styles.cardIconBg}>
            <Users size={24} color="#6366f1" />
          </View>
          <Text style={styles.cardTitle}>User Management</Text>
          <Text style={styles.cardDesc}>
            Search and remove users from the platform.
          </Text>
          <RNButton
            title="Manage Users"
            onPress={() => router.push("/(drawer)/admin/users")}
            style={{ marginTop: 12, width: "100%" }}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardIconBg}>
            <Layers size={24} color="#6366f1" />
          </View>
          <Text style={styles.cardTitle}>Task Management</Text>
          <Text style={styles.cardDesc}>
            Filter, view and delete learning tasks.
          </Text>
          <RNButton
            title="Manage Tasks"
            onPress={() => router.push("/(drawer)/admin/tasks")}
            style={{ marginTop: 12, width: "100%" }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { color: "#94a3b8", marginBottom: 24 },
  content: { padding: 20 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statTitle: { color: "#94a3b8", fontSize: 12, fontWeight: "600" },
  statValue: { fontSize: 24, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  cardIconBg: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    padding: 12,
    borderRadius: 50,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardDesc: { color: "#94a3b8", marginBottom: 12 },
});
