import { SettingRecord, UpdateSettingsResult } from "@/lib/types/settings";
import { SettingsState } from "@/store/settingsSlice";
import { useState } from "react";
import { Alert } from "react-native";
import { useModal } from "./use-modal";
import { UseMutateAsyncFunction } from "@tanstack/react-query";

interface UseLocalSettingsProps {
  settings: SettingsState;
  updateSettings: UseMutateAsyncFunction<
    UpdateSettingsResult,
    Error,
    SettingRecord[],
    unknown
  >;
}

const useLocalSettings = ({
  settings,
  updateSettings,
}: UseLocalSettingsProps) => {
  const { hideModal } = useModal();

  const [localGeneralOptions, setLocalGeneralOptions] = useState({
    ...settings.generalOptions,
  });

  const [localShortcuts, setLocalShortcuts] = useState({
    ...settings.shortcuts,
  });

  const handleSave = async () => {
    const settingsToUpdate: SettingRecord[] = [
      { setting_key: "theme", setting_value: localGeneralOptions.theme },
      {
        setting_key: "openSearchBox",
        setting_value: localShortcuts.openSearchBox,
      },
    ];

    const settingsMap = new Set<string>();

    for (const setting of settingsToUpdate) {
      if (settingsMap.has(setting.setting_value)) {
        Alert.alert(
          "Błąd",
          "Wartość nie może być przypisana do wielu ustawień."
        );
        return;
      }
      settingsMap.add(setting.setting_value);
    }

    try {
      await updateSettings(settingsToUpdate);
      setTimeout(() => {
        hideModal();
      }, 100);
    } catch {}
  };

  return {
    localGeneralOptions,
    localShortcuts,
    handleSave,
    setLocalGeneralOptions,
    setLocalShortcuts,
  };
};

export default useLocalSettings;
