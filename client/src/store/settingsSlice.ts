import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Shortcuts {
  openSearchBox: string;
  toggleHiddenFiles: string;
}

export interface SettingsState {
  theme: "light" | "dark" | "system";
  showHiddenFiles: boolean;
  shortcuts: Shortcuts;
}

const initialState: SettingsState = {
  theme: "system",
  showHiddenFiles: false,
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
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },
    toggleHiddenFiles: (state) => {
      state.showHiddenFiles = !state.showHiddenFiles;
    },
    setHiddenFiles: (state, action: PayloadAction<boolean>) => {
      state.showHiddenFiles = action.payload;
    },
    setShortcut: (
      state,
      action: PayloadAction<{ type: keyof Shortcuts; key: string }>
    ) => {
      const { type, key } = action.payload;
      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        state.shortcuts[type] = key.toLowerCase();
      }
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
