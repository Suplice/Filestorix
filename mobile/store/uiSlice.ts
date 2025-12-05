import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarWidth: number;
  tempWidth: number;
}

const initialState: UiState = {
  sidebarWidth: 0,
  tempWidth: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },
    setTempSidebarWidth: (state, action: PayloadAction<number>) => {
      state.tempWidth = action.payload;
    },
  },
});

export const { setSidebarWidth, setTempSidebarWidth } = uiSlice.actions;
export default uiSlice.reducer;
