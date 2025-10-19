import { UserDTO } from "./user"; // Assuming full User type is defined

export type UserShortInfo = UserDTO;

export type LeaderboardEntry = {
  rank: number;
  user: UserShortInfo;
  value: number; // The ranked value (level, points, or completed count)
  completedCourses?: number; // Only present for 'completed' criteria
};

// Define leaderboard criteria type
export type LeaderboardCriteria = "level" | "points" | "completed";

// Define filter type
export type LeaderboardFilter = "all" | "friends";
