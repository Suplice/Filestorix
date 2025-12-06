import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { GetAllTasksForUser } from "@/lib/api/task";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { deleteTask } from "@/lib/api/admin";
import { Task } from "@/lib/types/task";
import { RNInput, RNBadge, RNSkeleton } from "@/components/nativeComponents";
import {
  Search,
  Trash2,
  ArrowLeft,
  Code,
  BookOpen,
  FileQuestion,
} from "lucide-react-native";
import { ConfirmationModal } from "@/components/admin/ConfirmationModalProps";

export default function AdminTasksScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await GetAllTasksForUser(user.ID);
      setTasks(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load tasks from API.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const { filteredTasks, filters, setters } = useTaskFilters(tasks, user);

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteTask(taskToDelete.ID);

      if (result.message) {
        Alert.alert("Success", result.message);

        loadTasks();

        setTaskToDelete(null);
      } else {
        Alert.alert("Error", result.error || "Failed to delete task");
        setTaskToDelete(null);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          {item.type === "CODE" && <Code size={20} color="#3b82f6" />}
          {item.type === "QUIZ" && <BookOpen size={20} color="#22c55e" />}
          {item.type === "FILL_BLANK" && (
            <FileQuestion size={20} color="#f97316" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
            <RNBadge text={item.difficulty} />
            <RNBadge text={item.language} />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setTaskToDelete(item)}
          style={styles.deleteBtn}
        >
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.taskDesc} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.taskMeta}>
        ID: {item.ID} • {item.points} pts
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 12 }}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Tasks</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#94a3b8" style={{ marginRight: 10 }} />
        <RNInput
          placeholder="Search tasks..."
          value={filters.searchQuery}
          onChangeText={setters.setSearchQuery}
          style={{
            flex: 1,
            borderWidth: 0,
            backgroundColor: "transparent",
            height: 40,
          }}
        />
      </View>

      {loading && tasks.length === 0 ? (
        <View style={{ padding: 16 }}>
          <RNSkeleton
            style={{ height: 100, marginBottom: 12, width: "100%" }}
          />
          <RNSkeleton
            style={{ height: 100, marginBottom: 12, width: "100%" }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks found.</Text>
          }
        />
      )}

      <ConfirmationModal
        visible={!!taskToDelete}
        title="Delete Task?"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This will delete all questions and user progress.`}
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
        isLoading={isDeleting}
      />
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
  title: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardHeader: { flexDirection: "row", marginBottom: 10 },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#0f172a",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  taskDesc: { color: "#94a3b8", fontSize: 13, marginBottom: 8 },
  taskMeta: { color: "#64748b", fontSize: 11, textAlign: "right" },
  deleteBtn: { padding: 8 },
  emptyText: { color: "#94a3b8", textAlign: "center", marginTop: 20 },
});
