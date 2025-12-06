"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Star } from "lucide-react";
type TaskFilterControlsProps = {
  filters: {
    typeFilter: string;
    langFilter: string;
    diffFilter: string;
    sortBy: string;
    searchQuery: string;
    hideCompleted: boolean;
    recommendationFilter: string;
  };
  setters: {
    setTypeFilter: (value: string) => void;
    setLangFilter: (value: string) => void;
    setDiffFilter: (value: string) => void;
    setSortBy: (value: string) => void;
    setSearchQuery: (value: string) => void;
    setHideCompleted: (checked: boolean) => void;
    setRecommendationFilter: (value: "all" | "recommended") => void;
  };
  clearFilters: () => void;
};

export function TaskFilterControls({
  filters,
  setters,
  clearFilters,
}: TaskFilterControlsProps) {
  return (
    <div
      className={`
        flex flex-wrap items-center gap-3 p-3 rounded-xl border
        
        /* Zastosowano style light/dark Tailwinda */
        bg-white border-gray-200
        dark:bg-zinc-900 dark:border-zinc-800
      `}
    >
      <Select
        value={filters.recommendationFilter}
        onValueChange={
          setters.setRecommendationFilter as (value: string) => void
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Show tasks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="recommended">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Recomended</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search by title..."
        value={filters.searchQuery}
        onChange={(e) => setters.setSearchQuery(e.target.value)}
        className="w-[220px]"
      />

      <Select value={filters.typeFilter} onValueChange={setters.setTypeFilter}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="QUIZ">Quiz</SelectItem>
          <SelectItem value="FILL_BLANK">Fill Blank</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.langFilter} onValueChange={setters.setLangFilter}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Python">Python</SelectItem>
          <SelectItem value="Go">Go</SelectItem>
          <SelectItem value="JavaScript">JavaScript</SelectItem>
          <SelectItem value="TypeScript">TypeScript</SelectItem>
          <SelectItem value="C#">C#</SelectItem>
          <SelectItem value="Algorithms">Algorithms</SelectItem>
          <SelectItem value="General">General</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.diffFilter} onValueChange={setters.setDiffFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="EASY">Easy</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HARD">Hard</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sortBy} onValueChange={setters.setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alpha_asc">
            <div className="flex items-center gap-2">
              <span>Alphabetical</span>
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
          <SelectItem value="alpha_desc">
            <div className="flex items-center gap-2">
              <span>Alphabetical</span>
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
          <SelectItem value="xp_asc">
            <div className="flex items-center gap-2">
              <span>XP</span>
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
          <SelectItem value="xp_desc">
            <div className="flex items-center gap-2">
              <span>XP</span>
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
          <SelectItem value="points_asc">
            <div className="flex items-center gap-2">
              <span>Points</span>
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
          <SelectItem value="points_desc">
            <div className="flex items-center gap-2">
              <span>Points</span>
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
          <SelectItem value="created_asc">
            <div className="flex items-center gap-2">
              <span>Created</span>
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
          <SelectItem value="created_desc">
            <div className="flex items-center gap-2">
              <span>Created</span>
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={clearFilters}
        className="text-sm border-dashed hover:bg-muted transition-all"
      >
        Clear Filters
      </Button>
    </div>
  );
}
