import { Task } from "./task";
import { User } from "./user";

export type FriendshipStatus = {
  status: "not_friends" | "friends" | "request_sent" | "request_received";
  friendshipId?: number;
};

export type ProfileData = {
  user: User;
  totalCompleted: number;
  totalMistakes: number;
  tasksWithProgress: Task[];
  friendshipWithView?: FriendshipStatus;
};
