import { SettingRecord, UpdateSettingsResult } from "@/lib/types/settings";
import { SettingsState } from "@/store/settingsSlice";
import { useState } from "react";
import { toast } from "sonner";
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
        setting_key: "showHiddenFiles",
        setting_value: localGeneralOptions.showHiddenFiles ? "true" : "false",
      },
      {
        setting_key: "openSearchBox",
        setting_value: localShortcuts.openSearchBox,
      },
      {
        setting_key: "toggleHiddenFiles",
        setting_value: localShortcuts.toggleHiddenFiles,
      },
    ];

    const settingsMap = new Set<string>();

    for (const setting of settingsToUpdate) {
      if (settingsMap.has(setting.setting_value)) {
        toast.error("One value can't be associated with multiple settings.");
        return;
      }
      settingsMap.add(setting.setting_value);
    }

    await updateSettings(settingsToUpdate);
    setTimeout(() => {
      hideModal();
    }, 100);
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
