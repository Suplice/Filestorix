"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchLeaderboard } from "@/lib/api/leaderboard";
import {
  LeaderboardEntry,
  LeaderboardCriteria,
  LeaderboardFilter,
} from "@/lib/types/leaderboard";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardItem } from "@/components/ui/leaderboard/leaderboardItem";

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardCriteria>("level");
  const [filter, setFilter] = useState<LeaderboardFilter>("all");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    const data = await fetchLeaderboard(activeTab, filter);
    if (data) {
      setLeaderboardData(data.filter((i) => i.user.username !== "admin"));
    } else {
      setError(`Failed to load ${activeTab} leaderboard.`);
      toast.error(`Failed to load ${activeTab} leaderboard.`);
      setLeaderboardData([]);
    }
    setLoading(false);
  }, [activeTab, filter, currentUser]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const handleFilterChange = (checked: boolean | "indeterminate") => {
    setFilter(checked === true ? "friends" : "all");
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="friends-only-filter"
            checked={filter === "friends"}
            onCheckedChange={handleFilterChange}
            disabled={loading || !currentUser}
          />
          <Label
            htmlFor="friends-only-filter"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show friends only
          </Label>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as LeaderboardCriteria)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="level" disabled={loading}>
            Level
          </TabsTrigger>
          <TabsTrigger value="points" disabled={loading}>
            Points
          </TabsTrigger>
          <TabsTrigger value="completed" disabled={loading}>
            Completed Courses
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 min-h-[300px]">
          {" "}
          {loading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          )}
          {!loading && error && (
            <div className="text-center text-red-500 py-10">{error}</div>
          )}
          {!loading && !error && leaderboardData.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              No data available for this leaderboard view.
              {filter === "friends" && " Try viewing all users."}
            </div>
          )}
          {!loading && !error && leaderboardData.length > 0 && (
            <div className="space-y-1">
              {leaderboardData.map((entry) => (
                <LeaderboardItem
                  key={entry.user.ID}
                  entry={entry}
                  currentUser={currentUser}
                  criteria={activeTab}
                />
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
