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
import { Stack, useFocusEffect } from "expo-router";
import { GetAllTasksForUser } from "@/lib/api/task";
import { Task } from "@/lib/types/task";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { RNSkeleton, RNButton, RNSelect } from "@/components/nativeComponents";
import { Filter, X, Search, Sparkles, List } from "lucide-react-native";
import { TaskItem } from "@/components/ui/tasks/TaskItem";

export default function CoursesScreen() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    if (tasks.length === 0) setInitialLoading(true);

    try {
      const data = await GetAllTasksForUser(user.ID);
      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setInitialLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  // Pobieramy isLoadingRecs z hooka
  const { filteredTasks, filters, setters, clearFilters, isLoadingRecs } =
    useTaskFilters(tasks, user);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

  // Pokazuj szkielety, jeśli ładujemy wstępne dane LUB ładujemy rekomendacje z API
  const showSkeletons = (initialLoading && tasks.length === 0) || isLoadingRecs;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Courses",
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      {/* --- HEADER Z WYSZUKIWARKĄ --- */}
      <View style={styles.header}>
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

      {/* --- PRZEŁĄCZNIK REKOMENDACJI (TABS) --- */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            filters.recommendationFilter === "all" && styles.activeTab,
          ]}
          onPress={() => setters.setRecommendationFilter("all")}
        >
          <List
            size={16}
            color={filters.recommendationFilter === "all" ? "#fff" : "#94a3b8"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              filters.recommendationFilter === "all" && styles.activeTabText,
            ]}
          >
            All Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            filters.recommendationFilter === "recommended" && styles.activeTab,
          ]}
          onPress={() => setters.setRecommendationFilter("recommended")}
        >
          <Sparkles
            size={16}
            color={
              filters.recommendationFilter === "recommended"
                ? "#fff"
                : "#94a3b8"
            }
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.tabText,
              filters.recommendationFilter === "recommended" &&
                styles.activeTabText,
            ]}
          >
            Recommended
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- LISTA ZADAŃ --- */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {showSkeletons ? (
          <View>
            {[1, 2, 3, 4].map((i) => (
              <RNSkeleton
                key={i}
                style={{ height: 140, marginBottom: 16, width: "100%" }}
              />
            ))}
          </View>
        ) : filteredTasks.length === 0 ? (
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

      {/* --- MODAL FILTRÓW --- */}
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
    marginBottom: 12,
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
  // Style dla Tabs (Przełącznika)
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#3b82f6", // Niebieski kolor aktywnego taba
  },
  tabText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
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
