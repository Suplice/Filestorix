import { useAuth } from "@/context/AuthContext";
import { fetchSettings, updateSettings } from "@/lib/api/settings/settingsApi";
import { UpdateSettingsResult } from "@/lib/types/settings";
import { getErrorMessage, getSuccessMessage } from "@/lib/utils/ApiResponses";
import { setSettings } from "@/store/settingsSlice";
import { RootState } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";

const useSettings = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
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
    } else if (error) {
      console.error(error);
      Alert.alert("Błąd", getErrorMessage(error.message));
    }
  }, [data, error, dispatch]);

  const settingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (result: UpdateSettingsResult) => {
      Alert.alert("Sukces", getSuccessMessage(result.message));
    },
    onError: (error: Error) => {
      Alert.alert("Błąd", getErrorMessage(error.message));
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
    updateSettings: settingsMutation.mutateAsync,
    updating: settingsMutation.isPending,
  };
};

export default useSettings;
