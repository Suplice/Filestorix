import { BaseModel } from "./common";

export type Badge = BaseModel & {
  name: string;
  description: string;
  iconUrl?: string;
  requirement: string;
};

export type UserBadge = {
  userId: number;
  badgeId: number;
  achievedAt: string;

  badge?: Badge;
};
