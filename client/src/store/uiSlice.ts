import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getSidebarWidth = () => {
  const width = localStorage.getItem("sidebar-width");

  if (!width) {
    return 0;
  }

  return Number(width);
};

interface UiState {
  sidebarWidth: number;
  tempWidth: number;
}

const initialState: UiState = {
  sidebarWidth: getSidebarWidth(),
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
