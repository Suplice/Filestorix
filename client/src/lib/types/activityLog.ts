import { BaseModel } from "./common";

export type ActivityLog = BaseModel & {
  userId: number;
  actionType: string;
  description?: string;
  pointsEarned?: number;
  xpEarned?: number;
  timestamp: string;
};
