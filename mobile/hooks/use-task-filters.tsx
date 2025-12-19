import { useMemo, useState, useEffect } from "react";
import { Task } from "@/lib/types/task";
import { User } from "@/lib/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Zmień na swój adres IP jeśli testujesz na fizycznym telefonie
// Na emulatorze Androida: "http://10.0.2.2:5000"
// Na iOS/Web: "http://localhost:5000"
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

const saveFiltersToStorage = async (
  userId: number | undefined,
  filters: StoredFilters
) => {
  if (!userId) return;
  const key = `taskFilters_${userId}`;
  try {
    await AsyncStorage.setItem(key, JSON.stringify(filters));
  } catch (error) {
    console.error("Error saving filters:", error);
  }
};

export function useTaskFilters(tasks: Task[], user: User | null) {
  const userId = user?.ID;

  // --- Stany filtrów ---
  const [typeFilter, setTypeFilter] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);

  // Stan przełącznika: "all" (wszystkie) vs "recommended" (algorytm z backendu)
  const [recommendationFilter, setRecommendationFilter] = useState<
    "all" | "recommended"
  >("all");

  const [isLoaded, setIsLoaded] = useState(false);

  // --- Nowe stany dla obsługi backendowej rekomendacji ---
  const [recommendedTasks, setRecommendedTasks] = useState<Task[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  // 1. Ładowanie filtrów z pamięci urządzenia
  useEffect(() => {
    const loadFilters = async () => {
      if (!userId) return;
      try {
        const stored = await AsyncStorage.getItem(`taskFilters_${userId}`);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredFilters;
          if (parsed.type) setTypeFilter(parsed.type);
          if (parsed.lang) setLangFilter(parsed.lang);
          if (parsed.diff) setDiffFilter(parsed.diff);
          if (parsed.sort) setSortBy(parsed.sort);
          if (parsed.q) setSearchQuery(parsed.q);
          if (parsed.hideCompleted !== undefined)
            setHideCompleted(parsed.hideCompleted);
          if (parsed.show) setRecommendationFilter(parsed.show);
        }
      } catch (e) {
        console.error("Failed to load filters", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadFilters();
  }, [userId]);

  // 2. Zapisywanie filtrów przy każdej zmianie
  useEffect(() => {
    if (!isLoaded || !userId) return;

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
    isLoaded,
  ]);

  // 3. Pobieranie rekomendacji z backendu (NOWE)
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (recommendationFilter === "recommended" && userId) {
        setIsLoadingRecs(true);
        try {
          const response = await fetch(`${API_URL}/tasks/recommended`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(
              `Error fetching recommendations: ${response.statusText}`
            );
          }

          const data = await response.json();
          setRecommendedTasks(data); // Backend zwraca już posortowane!
        } catch (error) {
          console.error("Failed to fetch recommended tasks:", error);
          // W razie błędu można np. wrócić do trybu 'all' lub pokazać pustą listę
          setRecommendedTasks([]);
        } finally {
          setIsLoadingRecs(false);
        }
      }
    };

    fetchRecommendations();
  }, [recommendationFilter, userId]);

  const clearFilters = async () => {
    setTypeFilter("");
    setLangFilter("");
    setDiffFilter("");
    setSortBy("");
    setSearchQuery("");
    setHideCompleted(false);
    setRecommendationFilter("all");
    if (userId) {
      await AsyncStorage.removeItem(`taskFilters_${userId}`);
    }
  };

  // 4. Główna logika filtrowania (ZMODYFIKOWANA)
  const filteredTasks = useMemo(() => {
    // Krok A: Wybór źródła danych
    // Jeśli tryb rekomendacji -> bierzemy to co dał backend
    // Jeśli tryb 'all' -> bierzemy surową listę wszystkich zadań
    let result =
      recommendationFilter === "recommended"
        ? [...recommendedTasks]
        : [...tasks];

    // Krok B: Filtrowanie lokalne (wyszukiwanie, typ, język)
    // Nawet w rekomendowanych użytkownik może chcieć coś wyszukać
    if (typeFilter) result = result.filter((t) => t.type === typeFilter);
    if (langFilter) result = result.filter((t) => t.language === langFilter);

    // Filtr trudności (diff) zazwyczaj ma sens tylko w trybie "all",
    // bo rekomendacje same dobierają trudność, ale dla elastyczności zostawiam
    if (diffFilter) result = result.filter((t) => t.difficulty === diffFilter);

    if (searchQuery)
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (hideCompleted) {
      result = result.filter((t) => !t.user_progress?.is_completed);
    }

    // Krok C: Sortowanie
    // W trybie "recommended" backend już posortował zadania wg "Score",
    // więc sortujemy lokalnie TYLKO jeśli użytkownik wymusił inny sort (np. po dacie).
    // Jeśli sortBy jest puste i jesteśmy w "recommended", zostawiamy kolejność z backendu.

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
      // Domyślne sortowanie dla "all" (np. najnowsze)
      // Dla "recommended" domyślnym jest brak sortowania (kolejność z API)
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return result;
  }, [
    tasks,
    recommendedTasks, // Dodane jako zależność
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
    isLoaded,
    isLoadingRecs, // Eksportujemy, żeby można było pokazać spinner w UI
  };
}
