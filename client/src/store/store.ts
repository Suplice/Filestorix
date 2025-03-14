import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./fileSlice";
import modalReducer from "./modalSlice";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    file: fileReducer,
    modal: modalReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
