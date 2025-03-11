import { BaseResponse } from "./common";

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

export type FileRoute = {
  sectionName: string;
  catalogId: number | null;
};

export type FetchFilesResponse = {
  files?: UserFile[];
  error?: string;
};

export type UploadCatalogRequest = {
  name: string;
  parentId: number | null;
};

export type UploadFilesRequest = {
  files: File[];
  parentId: number | null;
};

export type RenameFileRequest = {
  name: string;
  fileId: number;
};

export type RenameFileResult = {
  fileId?: number;
  newName?: string;
  message?: string;
};

export type TrashFileRequest = {
  fileId: number;
};

export type TrashFileResult = {
  fileId: number;
  message: string;
};

export type TrashFileResponse = BaseResponse;

export type AddCatalogResponse = BaseResponse;

export type RenameFileResponse = BaseResponse;

export type AddFileResponse = BaseResponse & {
  files?: UserFile[];
};
