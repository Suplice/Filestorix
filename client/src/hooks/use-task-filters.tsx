"use client";

import { useMemo, useState } from "react";
import { Task } from "@/lib/types/task";

export function useTaskFilters(tasks: Task[]) {
  // Używamy "" jako wartości domyślnej (poprawka błędu)
  const [typeFilter, setTypeFilter] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const clearFilters = () => {
    setTypeFilter("");
    setLangFilter("");
    setDiffFilter("");
    setSortBy("");
    setSearchQuery("");
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Logika filtrowania (działa z "")
    if (typeFilter) result = result.filter((t) => t.type === typeFilter);
    if (langFilter) result = result.filter((t) => t.language === langFilter);
    if (diffFilter) result = result.filter((t) => t.difficulty === diffFilter);
    if (searchQuery)
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Logika sortowania
    switch (sortBy) {
      case "xp_asc":
        result.sort((a, b) => a.xp - b.xp);
        break;
      case "xp_desc":
        result.sort((a, b) => b.xp - a.xp);
        break;
      case "created_asc":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "created_desc":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "alpha_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alpha_desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [tasks, typeFilter, langFilter, diffFilter, sortBy, searchQuery]);

  return {
    filteredTasks,
    filters: {
      typeFilter,
      langFilter,
      diffFilter,
      sortBy,
      searchQuery,
    },
    setters: {
      setTypeFilter,
      setLangFilter,
      setDiffFilter,
      setSortBy,
      setSearchQuery,
    },
    clearFilters,
  };
}
