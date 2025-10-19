// Ścieżka: app/home/page.tsx

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
// Upewnij się, że ścieżki importu są poprawne dla Twojej struktury projektu

export default function HomePage() {
  const { user: currentUser, isAuthenticated } = useAuth();

  // Stany dla danych z API
  const [incomingRequests, setIncomingRequests] = useState<FriendshipInfo[]>(
    []
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  // Stany ładowania
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Funkcja do ładowania wszystkich danych dashboardu
  const loadDashboardData = useCallback(async () => {
    if (!currentUser) return; // Wyjdź, jeśli user nie jest załadowany

    // Resetuj stany ładowania przy każdym odświeżeniu
    setLoadingRequests(true);
    setLoadingLeaderboard(true);
    setLoadingTasks(true);

    try {
      // Użyj Promise.allSettled, aby kontynuować nawet jeśli jedno zapytanie zawiedzie
      const results = await Promise.allSettled([
        fetchIncomingRequests(),
        fetchLeaderboard("level", "friends"), // Pobierz ranking znajomych wg poziomu
        GetAllTasksForUser(currentUser.ID),
      ]);

      // Przetwarzanie wyników
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
      // Ogólny błąd (mało prawdopodobne z Promise.allSettled)
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data.");
    } finally {
      // Wyłącz wszystkie spinnery
      setLoadingRequests(false);
      setLoadingLeaderboard(false);
      setLoadingTasks(false);
    }
  }, [currentUser]); // Zależność od currentUser

  // Efekt do ładowania danych przy montowaniu i zmianie użytkownika
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Upewnij się, że jest uwierzytelniony
      loadDashboardData();
    } else if (!isAuthenticated) {
      // Jeśli użytkownik się wyloguje, wyczyść dane i zatrzymaj ładowanie
      setLoadingRequests(false);
      setLoadingLeaderboard(false);
      setLoadingTasks(false);
      setIncomingRequests([]);
      setLeaderboard([]);
      setUserTasks([]);
    }
    // Jeśli !currentUser, ale isAuthenticated=true, poczekaj aż AuthContext załaduje usera
  }, [currentUser, isAuthenticated, loadDashboardData]);

  // Znajdź zadanie do kontynuacji
  const taskToContinue = userTasks.find(
    (task) => task.user_progress && !task.user_progress.is_completed
  );

  // Znajdź pozycję użytkownika w rankingu
  const currentUserLeaderboardEntry = leaderboard.find(
    (entry) => entry.user.ID === currentUser?.ID
  );

  const isLoading = loadingRequests || loadingLeaderboard || loadingTasks;

  // Renderowanie Szkieletu
  if (
    !isAuthenticated ||
    (isAuthenticated && !currentUser && isLoading) // Show skeleton longer if user data isn't ready
  ) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        {" "}
        {/* Zwiększony odstęp */}
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        {/* Szkielet dla Continue Learning */}
        <Skeleton className="h-48 w-full" />
        {/* Szkielet dla widgetów obok siebie */}
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Renderowanie Braku Użytkownika
  if (!currentUser) {
    return (
      <div className="text-center p-10">
        Please log in to view your dashboard.
      </div>
    );
  }

  // --- GŁÓWNE RENDEROWANIE ---
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      {" "}
      {/* Główny kontener z odstępami */}
      {/* Sekcja Powitalna */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser.username}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your progress overview.
        </p>
      </div>
      {/* Sekcja Statystyk */}
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
      {/* Karta Kontynuuj Naukę (pełna szerokość) */}
      <ContinueLearningCard task={taskToContinue || null} />
      {/* Kontener dla Widgetów (Grid z dwiema kolumnami na md+) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Widget Zaproszeń */}
        <div>
          {" "}
          {/* Opakowanie dla widgetu */}
          <FriendRequestsWidget
            requests={incomingRequests}
            isLoading={loadingRequests}
            onActionComplete={loadDashboardData} // Odśwież wszystko po akcji
          />
        </div>
        {/* Widget Rankingu */}
        <div>
          {" "}
          {/* Opakowanie dla widgetu */}
          <LeaderboardWidget
            topEntries={leaderboard}
            currentUserEntry={currentUserLeaderboardEntry}
            isLoading={loadingLeaderboard}
            criteria="level" // Domyślnie pokazuj poziom
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}
