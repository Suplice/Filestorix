export type UserFile = {
  id: number;
  userId: number;
  name: string;
  extension: string;
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

export type UploadCatalogRequest = {
  name: string;
  parentId: number | null;
  userId: number;
};

export type UploadFilesRequest = {
  files: File[];
  parentId: number | null;
  userId: number;
};

export type RenameFileRequest = {
  name: string;
  fileId: number;
  userId: number;
};

export type RenameFileResult = {
  fileId?: number;
  newName?: string;
  message?: string;
};
