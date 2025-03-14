import { SettingsState } from "@/store/settingsSlice";
import { BaseResponse } from "./common";

export type SettingRecord = {
  setting_key: string;
  setting_value: string;
};

export type Settings = SettingsState;

export type FetchSettingsResponse = BaseResponse & {
  settings?: SettingRecord[];
};

export type FetchSettingsResult = {
  settings: Settings;
};

export type UpdateSettingsResult = {
  message: string;
};

export type UpdateSettingsResponse = BaseResponse;
