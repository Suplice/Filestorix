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
}

const initialState: UiState = {
  sidebarWidth: getSidebarWidth(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },
  },
});

export const { setSidebarWidth } = uiSlice.actions;
export default uiSlice.reducer;
