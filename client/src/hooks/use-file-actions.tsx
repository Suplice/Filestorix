"use client";
import {
  uploadFiles,
  uploadCatalog,
  deleteFile,
  trashCatalog,
  deleteCatalog,
  restoreFile,
  renameFile,
  trashFile,
  addFavoriteFile,
  removeFavoriteFile,
  hideFile,
  revealFile,
} from "@/lib/api/file/filesApi";
import {
  UserFile,
  RenameFileResult,
  TrashFileResult,
  DeleteFileResult,
  TrashCatalogResult,
  DeleteCatalogResult,
  FavoriteFileResult,
  HideFileResult,
} from "@/lib/types/file";
import { getErrorMessage, getSuccessMessage } from "@/lib/utils/ApiResponses";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const useFileActions = () => {
  const queryClient = useQueryClient();

  const { user } = useAuth();

  /**
   * Uploads one or multiple files to the server.
   *
   * @param data - An object containing the files and target catalog/folder ID.
   */
  const uploadFilesMutation = useMutation({
    mutationFn: uploadFiles,
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
    mutationFn: uploadCatalog,
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
    mutationFn: renameFile,
    onSuccess: (result: RenameFileResult) => {
      toast.success(getSuccessMessage(result.message));
      updateFilesQueryData(queryClient, user!.ID, result.fileId!, (file) => ({
        ...file,
        name: result.newName!,
      }));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
  });

  /**
   * Moves a file to trash (soft-delete).
   *
   * @param data - An object containing the file ID to be trashed.
   */
  const trashFileMutation = useMutation({
    mutationFn: trashFile,
    onSuccess: (result: TrashFileResult) => {
      toast.success(getSuccessMessage(result.message));

      updateFilesQueryData(queryClient, user!.ID, result.fileId, (file) => ({
        ...file,
        isTrashed: true,
      }));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
  });

  /**
   * Permanently deletes a file from the server.
   *
   * @param data - An object containing the file ID to be deleted.
   */
  const removeFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: (result: DeleteFileResult) => {
      toast.success(getSuccessMessage(result.message));

      updateFilesQueryData(
        queryClient,
        user!.ID,
        result.fileId,
        undefined,
        true
      );
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
  });

  /**
   * Moves a catalog (folder) to trash (soft-delete).
   *
   * @param data - An object containing the catalog ID to be trashed.
   */
  const trashCatalogMutation = useMutation({
    mutationFn: trashCatalog,
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
    mutationFn: deleteCatalog,
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
    mutationFn: restoreFile,
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

  const addFavoriteFileMutation = useMutation({
    mutationFn: addFavoriteFile,
    onSuccess: (result: FavoriteFileResult) => {
      toast.success(getSuccessMessage(result.message));
      updateFilesQueryData(queryClient, user!.ID, result.fileId, (file) => ({
        ...file,
        isFavorite: true,
      }));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
  });

  const removeFavoriteFileMutation = useMutation({
    mutationFn: removeFavoriteFile,
    onSuccess: (result: FavoriteFileResult) => {
      toast.success(getSuccessMessage(result.message));
      updateFilesQueryData(queryClient, user!.ID, result.fileId, (file) => ({
        ...file,
        isFavorite: false,
      }));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
  });

  const hideFileMutation = useMutation({
    mutationFn: hideFile,
    onSuccess: (result: HideFileResult) => {
      toast.success(getSuccessMessage(result.message));
      updateFilesQueryData(queryClient, user!.ID, result.fileId, (file) => ({
        ...file,
        isHidden: true,
      }));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
  });

  const revealFileMutation = useMutation({
    mutationFn: revealFile,
    onSuccess: (result: HideFileResult) => {
      toast.success(getSuccessMessage(result.message));
      updateFilesQueryData(queryClient, user!.ID, result.fileId, (file) => ({
        ...file,
        isHidden: false,
      }));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
  });

  const updateFilesQueryData = (
    queryClient: QueryClient,
    userId: number | undefined,
    fileId: number,
    updateFn?: (file: UserFile) => UserFile,
    remove: boolean = false
  ) => {
    queryClient.setQueryData(
      ["files", userId],
      (oldData: { files: UserFile[] } | undefined) => {
        if (!oldData || !Array.isArray(oldData.files)) {
          return { files: [] };
        }

        return {
          ...oldData,
          files: oldData.files
            .filter((file) => (remove ? file.id !== fileId : true))
            .map((file) =>
              file.id === fileId && updateFn ? updateFn(file) : file
            ),
        };
      }
    );
  };

  return {
    restoreFile: restoreFileMutation.mutate,
    deleteCatalog: deleteCatalogMutation.mutate,
    trashCatalog: trashCatalogMutation.mutate,
    removeFile: removeFileMutation.mutate,
    trashFile: trashFileMutation.mutate,
    renameFile: renameFileMutation.mutate,
    uploadCatalog: uploadCatalogMutation.mutate,
    uploadFiles: uploadFilesMutation.mutate,
    addFavoriteFile: addFavoriteFileMutation.mutate,
    removeFavoriteFile: removeFavoriteFileMutation.mutate,
    hideFile: hideFileMutation.mutate,
    revealFile: revealFileMutation.mutate,
    removeFavoriteFileLoading: removeFavoriteFileMutation.isPending,
    addFavoriteFileLoading: addFavoriteFileMutation.isPending,
    restoreFileLoading: restoreFileMutation.isPending,
    deleteCatalogLoading: deleteCatalogMutation.isPending,
    trashCatalogLoading: trashCatalogMutation.isPending,
    removeFileLoading: removeFileMutation.isPending,
    trashFileLoading: trashFileMutation.isPending,
    renameFileLoading: renameFileMutation.isPending,
    uploadCatalogLoading: uploadCatalogMutation.isPending,
    uploadFilesLoading: uploadFilesMutation.isPending,
  };
};

export default useFileActions;
