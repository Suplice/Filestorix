import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./fileSlice";
import modalReducer from "./modalSlice";
import settingsReducer from "./settingsSlice";
import locationReducer from "./locationSlice";
import filterReducer from "./filterSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    file: fileReducer,
    modal: modalReducer,
    settings: settingsReducer,
    location: locationReducer,
    filters: filterReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
