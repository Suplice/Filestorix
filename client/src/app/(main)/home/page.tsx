"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchIncomingRequests } from "@/lib/api/friends";
import { fetchLeaderboard } from "@/lib/api/leaderboard";
import { GetAllTasksForUser } from "@/lib/api/task";
import { FriendshipInfo } from "@/lib/types/user";
import { LeaderboardEntry } from "@/lib/types/leaderboard";
import { Task } from "@/lib/types/task";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Coins, Flame } from "lucide-react";
import { toast } from "sonner";
import { ContinueLearningCard } from "@/components/ui/dashboard/continueLearningCard";
import { FriendRequestsWidget } from "@/components/ui/dashboard/friendRequestWidget";
import { LeaderboardWidget } from "@/components/ui/dashboard/leaderboardWidget";
import { StatCard } from "@/components/ui/profile/statCard";

export default function HomePage() {
  const { user: currentUser, isAuthenticated } = useAuth();

  const [incomingRequests, setIncomingRequests] = useState<FriendshipInfo[]>(
    []
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!currentUser) return;

    setLoadingRequests(true);
    setLoadingLeaderboard(true);
    setLoadingTasks(true);

    try {
      const results = await Promise.allSettled([
        fetchIncomingRequests(),
        fetchLeaderboard("level", "friends"),
        GetAllTasksForUser(currentUser.ID),
      ]);

      if (results[0].status === "fulfilled" && results[0].value) {
        setIncomingRequests(results[0].value);
      } else {
        setIncomingRequests([]);
        if (results[0].status === "rejected")
          console.error("Error loading incoming requests:", results[0].reason);
      }

      if (results[1].status === "fulfilled" && results[1].value) {
        setLeaderboard(results[1].value);
      } else {
        setLeaderboard([]);
        if (results[1].status === "rejected")
          console.error("Error loading leaderboard:", results[1].reason);
      }

      if (results[2].status === "fulfilled" && results[2].value) {
        setUserTasks(results[2].value);
      } else {
        setUserTasks([]);
        if (results[2].status === "rejected")
          console.error("Error loading user tasks:", results[2].reason);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoadingRequests(false);
      setLoadingLeaderboard(false);
      setLoadingTasks(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadDashboardData();
    } else if (!isAuthenticated) {
      setLoadingRequests(false);
      setLoadingLeaderboard(false);
      setLoadingTasks(false);
      setIncomingRequests([]);
      setLeaderboard([]);
      setUserTasks([]);
    }
  }, [currentUser, isAuthenticated, loadDashboardData]);

  const taskToContinue = userTasks.find(
    (task) => task.user_progress && !task.user_progress.is_completed
  );

  const currentUserLeaderboardEntry = leaderboard.find(
    (entry) => entry.user.ID === currentUser?.ID
  );

  const isLoading = loadingRequests || loadingLeaderboard || loadingTasks;

  if (!isAuthenticated || (isAuthenticated && !currentUser && isLoading)) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        {" "}
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="text-center p-10">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser.username}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your progress overview.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Level"
          value={currentUser.level}
          icon={<Star className="w-5 h-5 text-yellow-400" />}
        />
        <StatCard
          title="Points"
          value={currentUser.points}
          icon={<Coins className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Current Streak"
          value={`${currentUser.streakCount} days`}
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
      </div>
      <ContinueLearningCard task={taskToContinue || null} />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <FriendRequestsWidget
            requests={incomingRequests}
            isLoading={loadingRequests}
            onActionComplete={loadDashboardData}
          />
        </div>
        <div>
          {" "}
          <LeaderboardWidget
            topEntries={leaderboard}
            currentUserEntry={currentUserLeaderboardEntry}
            isLoading={loadingLeaderboard}
            criteria="level"
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}
