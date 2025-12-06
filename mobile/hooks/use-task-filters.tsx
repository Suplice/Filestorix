import { useMemo, useState, useEffect } from "react";
import { Task } from "@/lib/types/task";
import { User } from "@/lib/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const SCORE_WEIGHTS = {
  NOT_ATTEMPTED_BONUS: 50,
  DIFFICULTY_MATCH_BONUS: 25,
  DIFFICULTY_ADJACENT_BONUS: 10,
  MISTAKE_PENALTY: -5,
  ATTEMPT_PENALTY: -2,
};

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

export function useTaskFilters(tasks: Task[], user: User | null) {
  const userId = user?.ID;

  const [typeFilter, setTypeFilter] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [recommendationFilter, setRecommendationFilter] = useState<
    "all" | "recommended"
  >("all");
  const [isLoaded, setIsLoaded] = useState(false);

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

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

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

          score += (Math.random() - 0.5) * 0.1;
          score += t.xp * 0.1;

          return { ...t, recommendationScore: score };
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore);

      if (typeFilter) result = result.filter((t) => t.type === typeFilter);
      if (langFilter) result = result.filter((t) => t.language === langFilter);
      if (searchQuery)
        result = result.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
      if (typeFilter) result = result.filter((t) => t.type === typeFilter);
      if (langFilter) result = result.filter((t) => t.language === langFilter);
      if (diffFilter)
        result = result.filter((t) => t.difficulty === diffFilter);
      if (searchQuery)
        result = result.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (hideCompleted) {
      result = result.filter((t) => !t.user_progress?.is_completed);
    }

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
        default:
          if (!sortBy) {
            result.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
          }
          break;
      }
    }

    return result;
  }, [
    tasks,
    typeFilter,
    langFilter,
    diffFilter,
    sortBy,
    searchQuery,
    hideCompleted,
    recommendationFilter,
    user,
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
  };
}
