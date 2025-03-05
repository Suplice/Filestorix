import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./fileSlice";
import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    file: fileReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
