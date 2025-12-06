import {
  LeaderboardEntry,
  LeaderboardCriteria,
  LeaderboardFilter,
} from "@/lib/types/leaderboard";

export const fetchLeaderboard = async (
  criteria: LeaderboardCriteria,
  filter: LeaderboardFilter
): Promise<LeaderboardEntry[] | null> => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/${criteria}?filter=${filter}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      console.error(
        `Error fetching leaderboard (${criteria}, ${filter}):`,
        errorData.error
      );
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Network error fetching leaderboard (${criteria}, ${filter}):`,
      error
    );
    return null;
  }
};
