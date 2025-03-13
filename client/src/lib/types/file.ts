import { LucideIcon } from "lucide-react";
import { BaseResponse } from "./common";

/* --------------------------- File & Catalog Types -------------------------- */

/**
 * Represents a user file or catalog (folder) stored in the system.
 */
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

/**
 * Represents the current file path/route inside the catalog structure.
 */
export type FileRoute = {
  sectionName: string;
  catalogId: number | null;
};

/* ------------------------------- API Responses ------------------------------ */

/**
 * API response for fetching user files.
 */
export type FetchFilesResponse = {
  files?: UserFile[];
  error?: string;
};

/**
 * API response after adding (uploading) a file.
 */
export type AddFileResponse = BaseResponse & {
  files?: UserFile[];
};

/**
 * API response after adding (creating) a catalog.
 */
export type AddCatalogResponse = BaseResponse;

/**
 * API response after renaming a file or catalog.
 */
export type RenameFileResponse = BaseResponse;

/**
 * API response after trashing (moving to trash) a file.
 */
export type TrashFileResponse = BaseResponse;

/**
 * API response after permanently deleting a file.
 */
export type DeleteFileResponse = BaseResponse;

/**
 * API response after trashing (moving to trash) a catalog.
 */
export type TrashCatalogResponse = BaseResponse;

/**
 * API response after permanently deleting a catalog.
 */
export type DeleteCatalogResponse = BaseResponse;

/**
 * API response after restoring a file from trash.
 */
export type RestoreFileResponse = BaseResponse;

/**
 * API response after adding file to favorite files or removing file from favorite files.
 */
export type FavoriteFileResponse = BaseResponse;

/* ----------------------------- API Requests ------------------------------ */

/**
 * Request to upload (create) a new catalog (folder).
 */
export type UploadCatalogRequest = {
  name: string;
  parentId: number | null;
};

/**
 * Request to upload files.
 */
export type UploadFilesRequest = {
  files: File[];
  parentId: number | null;
};

/**
 * Request to rename a file or catalog.
 */
export type RenameFileRequest = {
  name: string;
  fileId: number;
};

/**
 * Request to trash (move to trash) a file.
 */
export type TrashFileRequest = {
  fileId: number;
};

/**
 * Request to delete a file permanently (uses same structure as TrashFileRequest).
 */
export type DeleteFileRequest = TrashFileRequest;

/**
 * Request to trash (move to trash) a catalog.
 */
export type TrashCatalogRequest = TrashFileRequest;

/**
 * Request to delete a catalog permanently (uses same structure as TrashCatalogRequest).
 */
export type DeleteCatalogRequest = TrashCatalogRequest;

/**
 * Request to restore a file from trash.
 */
export type RestoreFileRequest = {
  fileId: number;
  parentId: number;
};

/**
 * Request to set a file as favorite or remove file from being favorite.
 */
export type FavoriteFileRequest = TrashFileRequest;

/* ----------------------------- API Results ------------------------------ */

/**
 * Result after renaming a file or catalog.
 */
export type RenameFileResult = {
  fileId?: number;
  newName?: string;
  message?: string;
};

/**
 * Result after trashing a file.
 */
export type TrashFileResult = {
  fileId: number;
  message: string;
};

/**
 * Result after deleting a file permanently (same as TrashFileResult).
 */
export type DeleteFileResult = TrashFileResult;

/**
 * Result after trashing a catalog.
 */
export type TrashCatalogResult = {
  message: string;
};

/**
 * Result after deleting a catalog permanently (same as TrashCatalogResult).
 */
export type DeleteCatalogResult = TrashCatalogResult;

/**
 * Result after restoring a file from trash (same as TrashCatalogResult).
 */
export type RestoreFileResult = TrashCatalogResult;

/**
 * Result after setting file as favorite or removing file from being favorite.
 */
export type FavoriteFileResult = TrashCatalogResult;

/* ---------------------------- Icon Mapping ---------------------------- */

/**
 * A mapping of file extensions to icons and their colors.
 */
export type FileIconMap = {
  [key: string]: {
    icon: LucideIcon;
    color: string;
  };
};
