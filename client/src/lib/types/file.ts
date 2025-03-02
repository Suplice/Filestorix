export type UserFile = {
  id: number;
  UserId: number;
  name: string;
  type: "FILE" | "CATALOG";
  size: number;
  path: string;
  modifiedAt: Date;
  CreatedAt: Date;
  isTrashed: boolean;
  parentId: number;
};
