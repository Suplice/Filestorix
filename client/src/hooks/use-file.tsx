"use client";
import { useAuth } from "@/context/AuthContext";
import { fetchUserFiles } from "@/lib/api/file/filesApi";
import { setFiles } from "@/store/fileSlice";
import { RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/ApiResponses";
import useSettings from "./use-settings";

export const useFile = () => {
  const dispatch = useDispatch();
  const files = useSelector((state: RootState) => state.file.files);

  const { user, isAuthenticated } = useAuth();

  const { settings } = useSettings();

  const query = useQuery({
    queryKey: ["files", user?.ID],
    queryFn: fetchUserFiles,
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
   * List of all files, with catalogs on top
   */
  const filteredFiles = useMemo(() => {
    return [...files].sort((a) => (a.type === "CATALOG" ? -1 : 1));
  }, [files]);

  /**
   * List of all files based on isHidden property
   */
  const hideBasedFiles = useMemo(() => {
    return query.isLoading
      ? []
      : settings.generalOptions.showHiddenFiles
      ? filteredFiles
      : filteredFiles.filter((file) => !file.isHidden);
  }, [settings.generalOptions.showHiddenFiles, query.isLoading, filteredFiles]);

  /**
   * List of all files without catalogs
   */
  const nonCatalogFiles = useMemo(() => {
    return query.isLoading
      ? []
      : hideBasedFiles.filter((file) => file.type !== "CATALOG");
  }, [hideBasedFiles, query.isLoading]);

  const catalogFiles = useMemo(() => {
    return query.isLoading
      ? []
      : hideBasedFiles.filter((file) => file.type !== "FILE");
  }, [hideBasedFiles, query.isLoading]);

  /**
   * List of all user files that are not trashed.
   */
  const baseFiles = useMemo(() => {
    return query.isLoading
      ? []
      : hideBasedFiles.filter((file) => !file.isTrashed);
  }, [query.isLoading, hideBasedFiles]);

  /**
   * List of user's favorite files.
   */
  const favoriteFiles = useMemo(() => {
    return query.isLoading
      ? []
      : hideBasedFiles.filter((file) => file.isFavorite && !file.isTrashed);
  }, [query.isLoading, hideBasedFiles]);

  /**
   * List of user's recently created or modified files, sorted by creation date descending.
   */
  const recentFiles = useMemo(() => {
    return query.isLoading
      ? []
      : [...hideBasedFiles].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  }, [query.isLoading, hideBasedFiles]);

  /**
   * List of user's trashed files (files in the trash bin).
   */
  const trashedFiles = useMemo(() => {
    return query.isLoading
      ? []
      : hideBasedFiles.filter((file) => file.isTrashed);
  }, [query.isLoading, hideBasedFiles]);

  return {
    nonCatalogFiles: nonCatalogFiles,
    catalogFiles,
    allFiles: hideBasedFiles,
    files: baseFiles,
    favoriteFiles,
    recentFiles,
    trashedFiles,
    isLoading: query.isPending || query.isFetching,
  };
};
