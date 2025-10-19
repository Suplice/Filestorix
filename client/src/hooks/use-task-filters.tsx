// Ścieżka: hooks/useTaskFilters.ts

"use client";

import { useMemo, useState, useEffect } from "react";
import { Task } from "@/lib/types/task";
import { User } from "@/lib/types/user";

// Definicja typu dla zapisywanego stanu filtrów w localStorage
type StoredFilters = {
  type?: string;
  lang?: string;
  diff?: string;
  sort?: string;
  q?: string; // 'q' for query (search)
  hideCompleted?: boolean;
  show?: "all" | "recommended";
};

// --- Funkcja pomocnicza do odczytu z localStorage ---
const loadFiltersFromStorage = (userId: number | undefined): StoredFilters => {
  // Sprawdź, czy jesteśmy po stronie klienta i czy mamy ID użytkownika
  if (typeof window === "undefined" || !userId) {
    return {}; // Zwróć pusty obiekt, jeśli SSR lub brak userId
  }
  const key = `taskFilters_${userId}`; // Klucz specyficzny dla użytkownika
  try {
    const stored = localStorage.getItem(key);
    // Jeśli coś jest zapisane, sparsuj JSON, w przeciwnym razie zwróć pusty obiekt
    return stored ? (JSON.parse(stored) as StoredFilters) : {};
  } catch (error) {
    console.error("Error loading filters from localStorage:", error);
    return {}; // Zwróć pusty obiekt w razie błędu parsowania
  }
};

// --- Funkcja pomocnicza do zapisu w localStorage ---
const saveFiltersToStorage = (
  userId: number | undefined,
  filters: StoredFilters
) => {
  // Sprawdź, czy jesteśmy po stronie klienta i czy mamy ID użytkownika
  if (typeof window === "undefined" || !userId) {
    return; // Nie zapisuj, jeśli SSR lub brak userId
  }
  const key = `taskFilters_${userId}`; // Klucz specyficzny dla użytkownika
  try {
    // Usuń klucze z wartościami undefined, aby nie zaśmiecać localStorage
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

// --- Stałe do ważenia rekomendacji (można je dostosować) ---
const SCORE_WEIGHTS = {
  NOT_ATTEMPTED_BONUS: 50,
  DIFFICULTY_MATCH_BONUS: 25,
  DIFFICULTY_ADJACENT_BONUS: 10,
  MISTAKE_PENALTY: -5,
  ATTEMPT_PENALTY: -2,
};

// --- Funkcje pomocnicze do rekomendacji ---
const getTargetDifficulty = (level: number): ("EASY" | "MEDIUM" | "HARD")[] => {
  if (level <= 2) return ["EASY"];
  if (level <= 4) return ["EASY", "MEDIUM"];
  return ["EASY", "MEDIUM", "HARD"];
};
const getIdealDifficulty = (level: number): "EASY" | "MEDIUM" | "HARD" => {
  if (level <= 2) return "EASY";
  if (level <= 4) return "MEDIUM";
  return "HARD";
};

// --- Główny Hook ---
export function useTaskFilters(tasks: Task[], user: User | null) {
  const userId = user?.ID; // Pobierz ID użytkownika

  // --- Odczyt stanu początkowego z localStorage ---
  // Używamy funkcji anonimowej w useState, aby odczyt był tylko raz przy montowaniu
  const [initialFilters] = useState(() => loadFiltersFromStorage(userId));

  // --- Stany ---
  // Inicjalizuj stany wartościami z localStorage lub domyślnymi
  const [typeFilter, setTypeFilter] = useState(initialFilters.type || "");
  const [langFilter, setLangFilter] = useState(initialFilters.lang || "");
  const [diffFilter, setDiffFilter] = useState(initialFilters.diff || "");
  const [sortBy, setSortBy] = useState(initialFilters.sort || "");
  const [searchQuery, setSearchQuery] = useState(initialFilters.q || "");
  const [hideCompleted, setHideCompleted] = useState(
    initialFilters.hideCompleted || false
  );
  const [recommendationFilter, setRecommendationFilter] = useState<
    "all" | "recommended"
  >(initialFilters.show || "all");

  // --- Efekt do zapisu stanu w localStorage ---
  useEffect(() => {
    // Zbierz aktualny stan filtrów do obiektu
    const currentFilters: StoredFilters = {
      type: typeFilter || undefined, // Zapisz undefined zamiast ""
      lang: langFilter || undefined,
      diff: diffFilter || undefined,
      sort: sortBy || undefined,
      q: searchQuery || undefined,
      hideCompleted: hideCompleted || undefined, // Zapisz undefined zamiast false
      show: recommendationFilter === "recommended" ? "recommended" : undefined, // Zapisz undefined dla "all"
    };
    // Zapisz zebrane filtry w localStorage
    saveFiltersToStorage(userId, currentFilters);
    // Wykonaj ten efekt za każdym razem, gdy zmieni się którykolwiek filtr LUB userId
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

  // --- Funkcja clearFilters ---
  const clearFilters = () => {
    // Resetuj stany komponentu
    setTypeFilter("");
    setLangFilter("");
    setDiffFilter("");
    setSortBy("");
    setSearchQuery("");
    setHideCompleted(false);
    setRecommendationFilter("all");
    // Wyczyść localStorage dla tego użytkownika
    if (typeof window !== "undefined" && userId) {
      localStorage.removeItem(`taskFilters_${userId}`);
    }
  };

  // --- Logika filtrowania i sortowania ---
  const filteredTasks = useMemo(() => {
    let result = [...tasks]; // Pracuj na kopii

    // --- Logika rekomendacji ---
    if (recommendationFilter === "recommended" && user) {
      const targetDifficulties = getTargetDifficulty(user.level);
      const idealDifficulty = getIdealDifficulty(user.level);

      result = result
        .filter((t) => {
          if (t.user_progress?.is_completed) return false;
          return targetDifficulties.includes(t.difficulty);
        })
        .map((t) => {
          let score = 0;
          const progress = t.user_progress;

          if (!progress || progress.attempts === 0) {
            score += SCORE_WEIGHTS.NOT_ATTEMPTED_BONUS;
          } else if (!progress.is_completed) {
            // Kary tylko dla nieukończonych
            score += (progress.mistakes || 0) * SCORE_WEIGHTS.MISTAKE_PENALTY;
            score +=
              Math.max(0, (progress.attempts || 0) - 1) *
              SCORE_WEIGHTS.ATTEMPT_PENALTY;
          }

          if (t.difficulty === idealDifficulty) {
            score += SCORE_WEIGHTS.DIFFICULTY_MATCH_BONUS;
          } else {
            const diffMap = { EASY: 1, MEDIUM: 2, HARD: 3 };
            if (
              Math.abs(diffMap[t.difficulty] - diffMap[idealDifficulty]) === 1
            ) {
              score += SCORE_WEIGHTS.DIFFICULTY_ADJACENT_BONUS;
            }
          }

          score += (Math.random() - 0.5) * 0.1; // Losowość
          score += t.xp * 0.1; // Waga XP

          return { ...t, recommendationScore: score };
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore);

      // Dodatkowe filtrowanie PO rekomendacji
      if (typeFilter) result = result.filter((t) => t.type === typeFilter);
      if (langFilter) result = result.filter((t) => t.language === langFilter);
      if (searchQuery)
        result = result.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      // Filtr 'diffFilter' już zastosowany przez targetDifficulties
    } else {
      // --- Standardowe filtry dla trybu "Wszystkie" ---
      if (typeFilter) result = result.filter((t) => t.type === typeFilter);
      if (langFilter) result = result.filter((t) => t.language === langFilter);
      if (diffFilter)
        result = result.filter((t) => t.difficulty === diffFilter);
      if (searchQuery)
        result = result.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } // Koniec bloku if/else dla recommendationFilter

    // --- Filtr ukrywania ukończonych ---
    // Stosowany zawsze, jeśli zaznaczony (w rekomendacjach też, jako dodatkowy failsafe)
    if (hideCompleted) {
      result = result.filter((t) => !t.user_progress?.is_completed);
    }

    // --- Sortowanie ---
    // Stosowane tylko w trybie "Wszystkie"
    if (recommendationFilter === "all") {
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
        // Domyślne sortowanie (np. ostatnio utworzone na górze), jeśli sortBy jest pusty
        default:
          if (!sortBy) {
            // Stosuj domyślne tylko jeśli sortBy nie jest wybrane
            result.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
          }
          break;
      }
    }
    // W trybie rekomendacji sortowanie jest już ustalone przez 'recommendationScore'

    return result;
  }, [
    // Zależności dla useMemo
    tasks,
    typeFilter,
    langFilter,
    diffFilter,
    sortBy,
    searchQuery,
    hideCompleted,
    recommendationFilter,
    user, // User jest potrzebny do rekomendacji
  ]);

  // --- Zwracana wartość hooka ---
  return {
    filteredTasks,
    // Przekaż aktualne wartości stanów
    filters: {
      typeFilter,
      langFilter,
      diffFilter,
      sortBy,
      searchQuery,
      hideCompleted,
      recommendationFilter,
    },
    // Settery po prostu ustawiają stan (useEffect zajmie się localStorage)
    setters: {
      setTypeFilter,
      setLangFilter,
      setDiffFilter,
      setSortBy,
      setSearchQuery,
      // Dla checkboxa shadcn/ui przekazuje boolean lub 'indeterminate'
      setHideCompleted: (checked: boolean | "indeterminate") =>
        setHideCompleted(checked === true),
      setRecommendationFilter,
    },
    clearFilters,
  };
}
