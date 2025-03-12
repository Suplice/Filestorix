import { LucideIcon } from "lucide-react";
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

export type DeleteFileRequest = TrashFileRequest;

export type TrashFileResult = {
  fileId: number;
  message: string;
};

export type DeleteFileResult = TrashFileResult;

export type TrashFileResponse = BaseResponse;

export type DeleteFileResponse = BaseResponse;

export type AddCatalogResponse = BaseResponse;

export type RenameFileResponse = BaseResponse;

export type TrashCatalogRequest = TrashFileRequest;

export type TrashCatalogResult = {
  message: string;
};

export type TrashCatalogResponse = BaseResponse;

export type DeleteCatalogResult = TrashCatalogResult;

export type DeleteCatalogResponse = BaseResponse;

export type DeleteCatalogRequest = TrashCatalogRequest;

export type RestoreFileRequest = {
  fileId: number;
  parentId: number;
};

export type RestoreFileResult = TrashCatalogResult;

export type RestoreFileResponse = BaseResponse;

export type AddFileResponse = BaseResponse & {
  files?: UserFile[];
};

export type FileIconMap = {
  [key: string]: {
    icon: LucideIcon;
    color: string;
  };
};
