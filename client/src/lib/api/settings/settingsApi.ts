import {
  FetchSettingsResponse,
  FetchSettingsResult,
  SettingRecord,
  Settings,
  ToggleHiddenRequest,
  UpdateSettingsResponse,
  UpdateSettingsResult,
} from "@/lib/types/settings";
import { Theme } from "@/store/settingsSlice";

export const fetchSettings = async (): Promise<FetchSettingsResult> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/`, {
    method: "GET",
    credentials: "include",
  });

  const responseData: FetchSettingsResponse = await response.json();

  if (!response.ok || !responseData.settings)
    throw new Error(responseData.error);

  const settings: Settings = {
    generalOptions: {
      theme: Theme.system,
      showHiddenFiles: false,
    },
    shortcuts: {
      openSearchBox: "j",
      toggleHiddenFiles: "h",
    },
  };

  responseData.settings.forEach((setting) => {
    switch (setting.setting_key) {
      case "theme":
        if (
          setting.setting_value === Theme.dark ||
          setting.setting_value === Theme.light ||
          setting.setting_value === Theme.system
        ) {
          settings.generalOptions.theme = setting.setting_value as Theme;
        }
        break;
      case "showHiddenFiles":
        settings.generalOptions.showHiddenFiles =
          setting.setting_value === "true";
        break;
      case "openSearchBox":
        settings.shortcuts.openSearchBox = setting.setting_value;
        break;
      case "toggleHiddenFiles":
        settings.shortcuts.toggleHiddenFiles = setting.setting_value;
        break;
      default:
        console.warn("Unknown setting:", setting.setting_key);
    }
  });

  return { settings: settings };
};

export const updateSettings = async (
  settings: SettingRecord[]
): Promise<UpdateSettingsResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/settings/update`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    }
  );

  const responseData: UpdateSettingsResponse = await response.json();

  if (!response.ok || !responseData.message)
    throw new Error(responseData.error);
  return { message: responseData.message };
};

export const toggleHidden = async (
  data: ToggleHiddenRequest
): Promise<UpdateSettingsResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/settings/togglehidden/${data.state}`,
    {
      credentials: "include",
      method: "PATCH",
    }
  );

  const responseData: UpdateSettingsResponse = await response.json();

  if (!response.ok || !responseData.message)
    throw new Error(responseData.error);
  return { message: responseData.message };
};
