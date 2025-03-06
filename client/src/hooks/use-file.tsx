"use client";
import { useAuth } from "@/context/AuthContext";
import {
  fetchUserFiles,
  uploadFiles,
  uploadCatalog,
} from "@/lib/api/file/filesApi";
import { setFiles } from "@/store/fileSlice";
import { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getErrorMessage, getSuccessMessage } from "@/lib/utils/ApiResponses";
import {
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
    queryFn: () => fetchUserFiles(user!.ID),
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

  const favoriteFiles = useMemo(() => {
    return query.isLoading ? [] : files.filter((file) => file.isFavorite);
  }, [query.isLoading, files]);

  const recentFiles = useMemo(() => {
    return query.isLoading
      ? []
      : [...files].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  }, [query.isLoading, files]);

  const trashedFiles = useMemo(() => {
    return query.isLoading ? [] : files.filter((file) => file.isTrashed);
  }, [query.isLoading, files]);

  const uploadFilesMutation = useMutation({
    mutationFn: (data: Omit<UploadFilesRequest, "userId">) =>
      uploadFiles({ ...data, userId: user!.ID }),
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

  const uploadCatalogMutation = useMutation({
    mutationFn: (data: Omit<UploadCatalogRequest, "userId">) =>
      uploadCatalog({ ...data, userId: user!.ID }),
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

  return {
    files,
    favoriteFiles,
    recentFiles,
    trashedFiles,
    isLoading: query.isLoading,
    uploadCatalog: uploadCatalogMutation.mutate,
    uploadFiles: uploadFilesMutation.mutate,
  };
};
