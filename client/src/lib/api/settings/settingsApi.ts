import {
  FetchSettingsResponse,
  FetchSettingsResult,
  SettingRecord,
  Settings,
  UpdateSettingsResponse,
  UpdateSettingsResult,
} from "@/lib/types/settings";

export const fetchSettings = async (): Promise<FetchSettingsResult> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/settings/all`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const responseData: FetchSettingsResponse = await response.json();

  if (!response.ok || !responseData.settings)
    throw new Error(responseData.error);

  const settings: Settings = {
    theme: "system",
    showHiddenFiles: false,
    shortcuts: {
      openSearchBox: "j",
      toggleHiddenFiles: "h",
    },
  };

  responseData.settings.forEach((setting) => {
    switch (setting.setting_key) {
      case "theme":
        if (["light", "dark", "system"].includes(setting.setting_value)) {
          settings.theme = setting.setting_value as Settings["theme"];
        }
        break;
      case "showHiddenFiles":
        settings.showHiddenFiles = setting.setting_value === "true";
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
