import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from "expo-router"; // DODANO useFocusEffect
import { GetAllTasksForUser } from "@/lib/api/task"; // Bezpośrednie API
import { Task } from "@/lib/types/task";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { RNSkeleton, RNButton, RNSelect } from "@/components/nativeComponents";
import { Filter, X, Search } from "lucide-react-native";
import { TaskItem } from "@/components/ui/tasks/TaskItem";

export default function CoursesScreen() {
  const { user } = useAuth();

  // Lokalny stan zadań zamiast hooka useTasks, aby kontrolować refresh
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Pobieranie danych
  const loadTasks = useCallback(async () => {
    if (!user) return;
    // Pokaż loader tylko jeśli nie mamy danych (pierwsze ładowanie)
    // Przy powrocie z zadania (focus) zrobimy cichy refresh
    if (tasks.length === 0) setLoading(true);

    try {
      const data = await GetAllTasksForUser(user.ID);
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [user]); // Zależność tylko od usera

  // --- KLUCZOWA ZMIANA ---
  // Odświeżaj listę za każdym razem, gdy ekran zyskuje focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const { filteredTasks, filters, setters, clearFilters } = useTaskFilters(
    tasks,
    user
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Opcje do filtrów
  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Quiz", value: "QUIZ" },
    { label: "Fill Blank", value: "FILL_BLANK" },
  ];
  const diffOptions = [
    { label: "All Difficulties", value: "all" },
    { label: "Easy", value: "EASY" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Hard", value: "HARD" },
  ];
  const langOptions = [
    "Python",
    "Go",
    "JavaScript",
    "TypeScript",
    "C#",
    "Algorithms",
    "General",
  ].map((l) => ({ label: l, value: l }));
  const sortOptions = [
    { label: "Created (Newest)", value: "created_desc" },
    { label: "Points (High to Low)", value: "points_desc" },
    { label: "Alphabetical", value: "alpha_asc" },
  ];

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        {[1, 2, 3, 4].map((i) => (
          <RNSkeleton
            key={i}
            style={{ height: 140, marginBottom: 16, width: "100%" }}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Ładny Input Wyszukiwania */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#94a3b8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor="#64748b"
            value={filters.searchQuery}
            onChangeText={setters.setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Przycisk Filtrów */}
        <RNButton
          icon={<Filter size={22} color="#fff" />}
          onPress={() => setIsFilterModalOpen(true)}
          style={{
            width: 52,
            height: 52,
            paddingHorizontal: 0,
            backgroundColor: "#334155",
          }}
        />
      </View>

      {/* Lista Zadań */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredTasks.length === 0 ? (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text style={styles.emptyText}>No tasks found.</Text>
            <RNButton
              title="Clear Filters"
              variant="ghost"
              onPress={clearFilters}
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          filteredTasks.map((task) => <TaskItem key={task.ID} task={task} />)
        )}
      </ScrollView>

      {/* Modal Filtrów */}
      <Modal
        visible={isFilterModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Tasks</Text>
            <TouchableOpacity onPress={() => setIsFilterModalOpen(false)}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }}>
            <RNSelect
              label="Sort By"
              value={filters.sortBy}
              onValueChange={setters.setSortBy}
              options={sortOptions}
              placeholder="Sort By"
            />
            <RNSelect
              label="Difficulty"
              value={filters.diffFilter}
              onValueChange={setters.setDiffFilter}
              options={[{ label: "All", value: "all" }, ...diffOptions]}
              placeholder="Difficulty"
            />
            <RNSelect
              label="Language"
              value={filters.langFilter}
              onValueChange={setters.setLangFilter}
              options={[{ label: "All", value: "all" }, ...langOptions]}
              placeholder="Language"
            />
            <RNSelect
              label="Type"
              value={filters.typeFilter}
              onValueChange={setters.setTypeFilter}
              options={typeOptions}
              placeholder="Type"
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <RNButton
                title="Clear"
                variant="outline"
                onPress={() => {
                  clearFilters();
                  setIsFilterModalOpen(false);
                }}
                style={{ flex: 1, borderColor: "#ef4444" }}
              />
              <RNButton
                title="Apply Filters"
                onPress={() => setIsFilterModalOpen(false)}
                style={{ flex: 2 }}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", padding: 16 },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    height: "100%",
  },
  listContent: { paddingBottom: 40 },
  emptyText: { color: "#94a3b8", textAlign: "center", fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: "#020617", padding: 20 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
});
