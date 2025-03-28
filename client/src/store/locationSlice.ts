import { FileRoute } from "@/lib/types/file";
import { Section } from "@/lib/utils/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  parentId: number | null;
  route: FileRoute[];
}

const initialState: LocationState = {
  parentId: null,
  route: [
    {
      sectionName: Section.Main,
      catalogId: null,
    },
  ],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setParentId: (
      state,
      action: PayloadAction<{ parentId: number | null }>
    ) => {
      state.parentId = action.payload.parentId;
    },
    setRoute: (state, action: PayloadAction<{ route: FileRoute[] }>) => {
      state.route = action.payload.route;
    },
  },
});

export const { setParentId, setRoute } = locationSlice.actions;
export default locationSlice.reducer;
