export type UserFile = {
  id: number;
  userId: number;
  name: string;
  type: "FILE" | "CATALOG";
  size: number;
  path: string;
  modifiedAt: Date;
  createdAt: Date;
  isTrashed: boolean;
  isFavorite: boolean;
  parentId: number;
};

export type FetchFilesResponse = {
  files?: UserFile[];
  error?: string;
};
