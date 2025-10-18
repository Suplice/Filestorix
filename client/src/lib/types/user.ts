import { BaseResponse, BaseModel } from "./common";
import { UserTaskProgress, Task } from "./task";
import { UserBadge } from "./badge";
import { ActivityLog } from "./activityLog";

export type User = BaseModel & {
  username: string;
  email: string;
  provider: string;
  avatarURL: string;
  role: string;
  passwordHash?: string;
  lastLoginAt?: string;
  googleId?: string;
  githubId?: string;
  level: number;
  xp: number;
  points: number;
  streakCount: number;
  lastActiveDate?: string;

  taskProgress?: UserTaskProgress[];
  friends?: Friendship[];
  badges?: UserBadge[];
  activities?: ActivityLog[];
  tasks?: Task[];
};

export type Friendship = {
  ID: number;
  userId: number;
  friendId: number;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
  friend?: User;
};

export type fetchUserResponse = BaseResponse & {
  user?: User;
};

export type fetchUserResult = fetchUserResponse & {
  ok?: boolean;
};

export type signFormResponse = BaseResponse & {
  user?: User;
};

export type signFormResult = signFormResponse & {
  ok?: boolean;
};
