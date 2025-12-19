"use client";

import { useMemo, useState, useEffect } from "react";
import { Task } from "@/lib/types/task";
import { User } from "@/lib/types/user";

// Adres backendu dla wersji Web (zazwyczaj localhost:5000)
const API_URL = "http://localhost:5000";

type StoredFilters = {
  type?: string;
  lang?: string;
  diff?: string;
  sort?: string;
  q?: string;
  hideCompleted?: boolean;
  show?: "all" | "recommended";
};

// Helper do ładowania z localStorage (bezpieczny dla SSR/Next.js)
const loadFiltersFromStorage = (userId: number | undefined): StoredFilters => {
  if (typeof window === "undefined" || !userId) {
    return {};
  }
  const key = `taskFilters_${userId}`;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as StoredFilters) : {};
  } catch (error) {
    console.error("Error loading filters from localStorage:", error);
    return {};
  }
};

// Helper do zapisywania do localStorage
const saveFiltersToStorage = (
  userId: number | undefined,
  filters: StoredFilters
) => {
  if (typeof window === "undefined" || !userId) {
    return;
  }
  const key = `taskFilters_${userId}`;
  try {
    const filtersToSave: Partial<StoredFilters> = {};
    for (const k in filters) {
      const key = k as keyof StoredFilters;
      if (filters[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (filtersToSave as any)[key] = filters[key];
      }
    }
    localStorage.setItem(key, JSON.stringify(filtersToSave));
  } catch (error) {
    console.error("Error saving filters to localStorage:", error);
  }
};

export function useTaskFilters(tasks: Task[], user: User | null) {
  const userId = user?.ID;

  // 1. Inicjalizacja stanów z localStorage (synchronicznie dla Weba)
  const [initialFilters] = useState(() => loadFiltersFromStorage(userId));

  const [typeFilter, setTypeFilter] = useState(initialFilters.type || "");
  const [langFilter, setLangFilter] = useState(initialFilters.lang || "");
  const [diffFilter, setDiffFilter] = useState(initialFilters.diff || "");
  const [sortBy, setSortBy] = useState(initialFilters.sort || "");
  const [searchQuery, setSearchQuery] = useState(initialFilters.q || "");
  const [hideCompleted, setHideCompleted] = useState(
    initialFilters.hideCompleted || false
  );

  // Przełącznik trybu: Wszystkie vs Rekomendowane (Backend)
  const [recommendationFilter, setRecommendationFilter] = useState<
    "all" | "recommended"
  >(initialFilters.show || "all");

  // --- Nowe stany dla rekomendacji z API ---
  const [recommendedTasks, setRecommendedTasks] = useState<Task[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  // 2. Zapisywanie filtrów przy każdej zmianie
  useEffect(() => {
    const currentFilters: StoredFilters = {
      type: typeFilter || undefined,
      lang: langFilter || undefined,
      diff: diffFilter || undefined,
      sort: sortBy || undefined,
      q: searchQuery || undefined,
      hideCompleted: hideCompleted || undefined,
      show: recommendationFilter === "recommended" ? "recommended" : undefined,
    };
    saveFiltersToStorage(userId, currentFilters);
  }, [
    typeFilter,
    langFilter,
    diffFilter,
    sortBy,
    searchQuery,
    hideCompleted,
    recommendationFilter,
    userId,
  ]);

  // 3. Pobieranie rekomendacji z API
  useEffect(() => {
    const fetchRecommendations = async () => {
      // Pobieramy tylko gdy użytkownik wybrał filtr "recommended" i jest zalogowany
      if (recommendationFilter === "recommended" && userId) {
        setIsLoadingRecs(true);
        try {
          const response = await fetch(`${API_URL}/tasks/recommended`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // WAŻNE: To sprawia, że ciasteczka (HttpOnly) są wysyłane z zapytaniem
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(
              `Error fetching recommendations: ${response.statusText}`
            );
          }

          const data = await response.json();
          setRecommendedTasks(data); // Backend zwraca posortowane wg Score
        } catch (error) {
          console.error("Failed to fetch recommended tasks:", error);
          setRecommendedTasks([]);
        } finally {
          setIsLoadingRecs(false);
        }
      }
    };

    fetchRecommendations();
  }, [recommendationFilter, userId]);

  const clearFilters = () => {
    setTypeFilter("");
    setLangFilter("");
    setDiffFilter("");
    setSortBy("");
    setSearchQuery("");
    setHideCompleted(false);
    setRecommendationFilter("all");
    if (typeof window !== "undefined" && userId) {
      localStorage.removeItem(`taskFilters_${userId}`);
    }
  };

  // 4. Główna logika filtrowania i sortowania
  const filteredTasks = useMemo(() => {
    // Wybór źródła danych: Backend (Rekomendacje) lub Wszystkie (Props)
    let result =
      recommendationFilter === "recommended"
        ? [...recommendedTasks]
        : [...tasks];

    // A. Filtrowanie
    if (typeFilter) result = result.filter((t) => t.type === typeFilter);
    if (langFilter) result = result.filter((t) => t.language === langFilter);

    // Filtr trudności ma sens głównie w trybie "all", ale zostawiamy dla spójności
    if (diffFilter) result = result.filter((t) => t.difficulty === diffFilter);

    if (searchQuery)
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (hideCompleted) {
      result = result.filter((t) => !t.user_progress?.is_completed);
    }

    // B. Sortowanie
    // W trybie "recommended" domyślna kolejność z API jest najważniejsza (wg algorytmu).
    // Sortujemy tylko jeśli użytkownik wymusił konkretne kryterium.

    if (sortBy) {
      switch (sortBy) {
        case "xp_asc":
          result.sort((a, b) => a.xp - b.xp);
          break;
        case "xp_desc":
          result.sort((a, b) => b.xp - a.xp);
          break;
        case "points_asc":
          result.sort((a, b) => a.points - b.points);
          break;
        case "points_desc":
          result.sort((a, b) => b.points - a.points);
          break;
        case "created_asc":
          result.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
          break;
        case "created_desc":
          result.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
        case "alpha_asc":
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "alpha_desc":
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    } else if (recommendationFilter === "all") {
      // Domyślne sortowanie tylko dla trybu "all" (np. najnowsze)
      // Dla "recommended" zostawiamy tak jak przyszło z backendu
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result;
  }, [
    tasks,
    recommendedTasks, // Zależność od danych z API
    typeFilter,
    langFilter,
    diffFilter,
    sortBy,
    searchQuery,
    hideCompleted,
    recommendationFilter,
  ]);

  return {
    filteredTasks,
    filters: {
      typeFilter,
      langFilter,
      diffFilter,
      sortBy,
      searchQuery,
      hideCompleted,
      recommendationFilter,
    },
    setters: {
      setTypeFilter,
      setLangFilter,
      setDiffFilter,
      setSortBy,
      setSearchQuery,
      setHideCompleted: (checked: boolean | "indeterminate") =>
        setHideCompleted(checked === true),
      setRecommendationFilter,
    },
    clearFilters,
    isLoadingRecs,
  };
}
