import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import settingsReducer from "./settingsSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
