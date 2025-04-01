import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ModifiedAtTimeStamp {
  ALLTIME = "All time",
  LESS30 = "Less than 30 days ago",
  LESS7 = "Less than 7 days ago",
  LESS1 = "Less that 1 day ago",
}

export enum Order {
  ASC = "Ascending",
  DESC = "Descending",
}

export enum VisibleFilesCategory {
  FILES = "Only files",
  CATALOGS = "Only catalogs",
  ALL = "All",
}

export enum VisibleExtensionCategory {
  PDF = "pdf",
  TXT = "txt",
  JPG = "jpg",
  PNG = "png",
  XLS = "xls",
  ALL = "All extensions",
}

interface FilterState {
  name: Order | undefined;
  modifiedAt: Order | undefined;
  modifiedAtTimeStamp: ModifiedAtTimeStamp;
  visibleFilesCategory: VisibleFilesCategory;
  visibleExtension: VisibleExtensionCategory;
}

const initialState: FilterState = {
  name: undefined,
  modifiedAt: undefined,
  modifiedAtTimeStamp: ModifiedAtTimeStamp.ALLTIME,
  visibleFilesCategory: VisibleFilesCategory.ALL,
  visibleExtension: VisibleExtensionCategory.ALL,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<Order | undefined>) => {
      state.name = action.payload;
    },
    setModifiedAt: (state, action: PayloadAction<Order | undefined>) => {
      state.modifiedAt = action.payload;
    },
    setModifiedAtTimeStamp: (
      state,
      action: PayloadAction<ModifiedAtTimeStamp>
    ) => {
      state.modifiedAtTimeStamp = action.payload;
    },
    setVisibleFilesCategory: (
      state,
      action: PayloadAction<VisibleFilesCategory>
    ) => {
      state.visibleFilesCategory = action.payload;
    },
    setVisibleExtension: (
      state,
      action: PayloadAction<VisibleExtensionCategory>
    ) => {
      state.visibleExtension = action.payload;
    },
  },
});

export const {
  setName,
  setModifiedAt,
  setModifiedAtTimeStamp,
  setVisibleFilesCategory,
  setVisibleExtension,
} = filterSlice.actions;
export default filterSlice.reducer;
