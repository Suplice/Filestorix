"use client";
import { useAuth } from "@/context/AuthContext";
import {
  fetchUserFiles,
  uploadFiles,
  uploadCatalog,
  renameFile,
  trashFile,
  deleteFile,
  trashCatalog,
  deleteCatalog,
  restoreFile,
} from "@/lib/api/file/filesApi";
import {
  setFiles,
  renameFile as sliceFileRename,
  trashFile as sliceTrashFile,
} from "@/store/fileSlice";
import { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getErrorMessage, getSuccessMessage } from "@/lib/utils/ApiResponses";
import type {
  DeleteCatalogRequest,
  DeleteCatalogResult,
  DeleteFileRequest,
  DeleteFileResult,
  RenameFileRequest,
  RenameFileResult,
  RestoreFileRequest,
  TrashCatalogRequest,
  TrashCatalogResult,
  TrashFileRequest,
  TrashFileResult,
  UploadCatalogRequest,
  UploadFilesRequest,
  UserFile,
} from "@/lib/types/file";

export const useFile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const files = useSelector((state: RootState) => state.file.files);

  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["files", user?.ID],
    queryFn: () => fetchUserFiles(),
    enabled: isAuthenticated,
    retry: 0,
    staleTime: 5 * 60 * 1000,
    throwOnError: true,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setFiles(query.data.files!));
    } else if (query.error) {
      toast.error(getErrorMessage(query.error.message));
    }
  }, [query.data, query.error, dispatch]);

  /**
   * List of all user files that are not trashed.
   */
  const baseFiles = useMemo(() => {
    return query.isLoading ? [] : files.filter((file) => !file.isTrashed);
  }, [query.isLoading, files]);

  /**
   * List of user's favorite files.
   */
  const favoriteFiles = useMemo(() => {
    return query.isLoading ? [] : files.filter((file) => file.isFavorite);
  }, [query.isLoading, files]);

  /**
   * List of user's recently created or modified files, sorted by creation date descending.
   */
  const recentFiles = useMemo(() => {
    return query.isLoading
      ? []
      : [...files].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  }, [query.isLoading, files]);

  /**
   * List of user's trashed files (files in the trash bin).
   */
  const trashedFiles = useMemo(() => {
    return query.isLoading ? [] : files.filter((file) => file.isTrashed);
  }, [query.isLoading, files]);

  /**
   * Uploads one or multiple files to the server.
   *
   * @param data - An object containing the files and target catalog/folder ID.
   */
  const uploadFilesMutation = useMutation({
    mutationFn: (data: UploadFilesRequest) => uploadFiles(data),
    onSuccess: (newFiles: UserFile[]) => {
      console.log(newFiles);
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  /**
   * Creates a new catalog (folder) on the server.
   *
   * @param data - An object containing the catalog name and optional parent catalog ID.
   */
  const uploadCatalogMutation = useMutation({
    mutationFn: (data: UploadCatalogRequest) => uploadCatalog(data),
    onSuccess: (message: string) => {
      toast.success(getSuccessMessage(message));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  /**
   * Renames an existing file or catalog.
   *
   * @param data - An object containing the file ID and the new name.
   */
  const renameFileMutation = useMutation({
    mutationFn: (data: RenameFileRequest) => renameFile(data),
    onSuccess: (result: RenameFileResult) => {
      toast.success(getSuccessMessage(result.message));
      dispatch(
        sliceFileRename({ fileId: result.fileId, newName: result.newName })
      );
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  /**
   * Moves a file to trash (soft-delete).
   *
   * @param data - An object containing the file ID to be trashed.
   */
  const trashFileMutation = useMutation({
    mutationFn: (data: TrashFileRequest) => trashFile(data),
    onSuccess: (result: TrashFileResult) => {
      toast.success(getSuccessMessage(result.message));
      dispatch(sliceTrashFile({ fileId: result.fileId }));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  /**
   * Permanently deletes a file from the server.
   *
   * @param data - An object containing the file ID to be deleted.
   */
  const removeFileMutation = useMutation({
    mutationFn: (data: DeleteFileRequest) => deleteFile(data),
    onSuccess: (result: DeleteFileResult) => {
      toast.success(getSuccessMessage(result.message));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  /**
   * Moves a catalog (folder) to trash (soft-delete).
   *
   * @param data - An object containing the catalog ID to be trashed.
   */
  const trashCatalogMutation = useMutation({
    mutationFn: (data: TrashCatalogRequest) => trashCatalog(data),
    onSuccess: (result: TrashCatalogResult) => {
      toast.success(getSuccessMessage(result.message));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  /**
   * Permanently deletes a catalog (folder) from the server.
   *
   * @param data - An object containing the catalog ID to be deleted.
   */
  const deleteCatalogMutation = useMutation({
    mutationFn: (data: DeleteCatalogRequest) => deleteCatalog(data),
    onSuccess: (result: DeleteCatalogResult) => {
      toast.success(getSuccessMessage(result.message));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  /**
   * Restores a previously trashed file and moves it back to its original or specified parent catalog.
   *
   * @param data - An object containing the file ID and the parent ID where the file should be restored.
   */
  const restoreFileMutation = useMutation({
    mutationFn: (data: RestoreFileRequest) => restoreFile(data),
    onSuccess: (result: DeleteCatalogResult) => {
      toast.success(getSuccessMessage(result.message));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
    },
  });

  return {
    files: baseFiles,
    favoriteFiles,
    recentFiles,
    trashedFiles,
    isLoading: query.isPending || query.isFetching,
    restoreFile: restoreFileMutation.mutate,
    deleteCatalog: deleteCatalogMutation.mutate,
    trashCatalog: trashCatalogMutation.mutate,
    removeFile: removeFileMutation.mutate,
    trashFile: trashFileMutation.mutate,
    renameFile: renameFileMutation.mutate,
    uploadCatalog: uploadCatalogMutation.mutate,
    uploadFiles: uploadFilesMutation.mutate,
  };
};
