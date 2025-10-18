import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Theme {
  light = "light",
  dark = "dark",
  system = "system",
}

export interface Shortcuts {
  openSearchBox: string;
}

export interface GeneralOptions {
  theme: Theme;
}

export interface SettingsState {
  generalOptions: GeneralOptions;
  shortcuts: Shortcuts;
}

export const initialState: SettingsState = {
  generalOptions: {
    theme: Theme.system,
  },
  shortcuts: {
    openSearchBox: "j",
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

    setShortcut: (
      state,
      action: PayloadAction<{ type: keyof Shortcuts; key: string }>
    ) => {
      const { type, key } = action.payload;

      state.shortcuts[type] = key.toLowerCase();
    },
  },
});

export const { toggleTheme, setTheme, setShortcut, setSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
