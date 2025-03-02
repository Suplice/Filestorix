"use client";
import { useAuth } from "@/context/AuthContext";
import { fetchUserFiles } from "@/lib/api/file/filesApi";
import { setFiles } from "@/store/fileSlice";
import { RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useFile = () => {
  const dispatch = useDispatch();
  // const queryClient = useQueryClient();
  const files = useSelector((state: RootState) => state.file.files);

  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["files", user?.ID],
    queryFn: () => fetchUserFiles(user!.ID),
    enabled: isAuthenticated,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setFiles(query.data));
      return;
    } else if (query.error) {
      console.log(query.error);
      toast.error(query.error?.message);
    }
  }, [query, dispatch]);

  //   const uploadMutation = useMutation({
  //     mutationFn: (file: UserFile, userId: number) => uploadFile(file, userId),
  //     onSuccess: (newFile: UserFile) => {
  //       dispatch(addFile(newFile));
  //       queryClient.invalidateQueries({ queryKey: ["files", user?.ID] });
  //     },
  //     onError: (error: Error) => {
  //       toast.error(error.message);
  //     },
  //   });

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
    // uploadFile: uploadMutation.mutate,
    // deleteFile: uploadMutation.mutate,
  };
};
