"use client";
import { useAuth } from "@/context/AuthContext";
import { fetchUserFiles, uploadFiles } from "@/lib/api/file/filesApi";
import { setFiles } from "@/store/fileSlice";
import { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/ApiResponses";
import { UserFile } from "@/lib/types/file";

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
      return;
    } else if (query.error) {
      console.log(query.error);
      toast.error(getErrorMessage(query.error.message));
    }
  }, [query, dispatch]);

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => uploadFiles(files, user!.ID),
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

  //   const deleteMutation = useMutation({
  //     mutationFn: (fileId: number, userId: number) => deleteFile(fileId, userId),
  //     onSuccess: (fileId: number) => {
  //       dispatch(removeFile(fileId));
  //       queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
  //     },
  //     onError: (error: Error) => {
  //       toast.error(error.message);
  //     },
  //   });

  return {
    files,
    isLoading: query.isLoading,
    uploadFiles: uploadMutation.mutate,
    // deleteFile: uploadMutation.mutate,
  };
};
