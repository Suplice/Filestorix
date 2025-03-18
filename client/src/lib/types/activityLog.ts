export type ActivityLog = {
  id: number;
  userId: number;
  fileId: number;
  action: string;
  details: string;
  performedAt: Date;
};

export type FetchActivityLogResponse = {
  logs?: ActivityLog[];
  error?: string;
};
