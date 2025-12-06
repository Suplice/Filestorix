import { UserDTO } from "./user";

export type UserShortInfo = UserDTO;

export type LeaderboardEntry = {
  rank: number;
  user: UserShortInfo;
  value: number;
  completedCourses?: number;
};

export type LeaderboardCriteria = "level" | "points" | "completed";

export type LeaderboardFilter = "all" | "friends";
