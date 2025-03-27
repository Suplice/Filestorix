import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Theme {
  light = "light",
  dark = "dark",
  system = "system",
}

export interface Shortcuts {
  openSearchBox: string;
  toggleHiddenFiles: string;
}

export interface GeneralOptions {
  theme: Theme;
  showHiddenFiles: boolean;
}

export interface SettingsState {
  generalOptions: GeneralOptions;
  shortcuts: Shortcuts;
}

export const initialState: SettingsState = {
  generalOptions: {
    theme: Theme.system,
    showHiddenFiles: false,
  },
  shortcuts: {
    openSearchBox: "j",
    toggleHiddenFiles: "h",
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      Object.assign(state, action.payload);
    },
    toggleTheme: (state) => {
      state.generalOptions.theme =
        state.generalOptions.theme === Theme.dark ? Theme.light : Theme.dark;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.generalOptions.theme = action.payload;
    },
    toggleHiddenFiles: (state) => {
      state.generalOptions.showHiddenFiles =
        !state.generalOptions.showHiddenFiles;
    },
    setHiddenFiles: (state, action: PayloadAction<boolean>) => {
      state.generalOptions.showHiddenFiles = action.payload;
    },
    setShortcut: (
      state,
      action: PayloadAction<{ type: keyof Shortcuts; key: string }>
    ) => {
      const { type, key } = action.payload;

      state.shortcuts[type] = key.toLowerCase();
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleHiddenFiles,
  setHiddenFiles,
  setShortcut,
  setSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
