// Ścieżka: lib/types/profile.ts
import { Task } from "./task";
import { User } from "./user";

export type FriendshipStatus = {
  status: "not_friends" | "friends" | "request_sent" | "request_received";
  friendshipId?: number;
};

// Główny typ danych profilu
export type ProfileData = {
  user: User;
  totalCompleted: number;
  totalMistakes: number;
  tasksWithProgress: Task[]; // Backend zwraca zadania już z polem user_progress
  friendshipWithView?: FriendshipStatus;
};
