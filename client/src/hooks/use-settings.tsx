"use client";
import { useAuth } from "@/context/AuthContext";
import { fetchSettings, updateSettings } from "@/lib/api/settings/settingsApi";
import { UpdateSettingsResult } from "@/lib/types/settings";
import { getErrorMessage, getSuccessMessage } from "@/lib/utils/ApiResponses";
import { setSettings } from "@/store/settingsSlice";
import { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useSettings = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { setTheme } = useTheme();
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const { data, isLoading, error, refetch, isPending, isFetching } = useQuery({
    queryKey: ["settings", user?.ID],
    queryFn: fetchSettings,
    enabled: isAuthenticated,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      dispatch(setSettings(data.settings));
      setTheme(data.settings.theme);
    } else if (error) {
      toast.error(getErrorMessage(error.message));
    }
  }, [data, error, dispatch, setTheme]);

  const settingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (result: UpdateSettingsResult) => {
      toast.success(getSuccessMessage(result.message));
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error.message));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", user?.ID] });
    },
  });

  return {
    settings: settings,
    loading: isLoading,
    isFetching: isFetching,
    isPending: isPending,
    error,
    refresh: refetch,
    updateSettings: settingsMutation.mutate,
    updating: settingsMutation.isPending,
  };
};

export default useSettings;
