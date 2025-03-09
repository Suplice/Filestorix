import { RenameFileResult, UserFile, TrashFileResult } from "@/lib/types/file";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileState {
  files: UserFile[];
}

const initialState: FileState = {
  files: [],
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<UserFile[]>) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<UserFile>) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    renameFile: (
      state,
      action: PayloadAction<Omit<RenameFileResult, "message">>
    ) => {
      const file = state.files.find(
        (file) => file.id === action.payload.fileId
      );
      if (file) {
        file.name = action.payload.newName!;
      }
    },
    trashFile: (
      state,
      action: PayloadAction<Omit<TrashFileResult, "message">>
    ) => {
      const file = state.files.find(
        (file) => file.id === action.payload.fileId
      );
      if (file) {
        file.isTrashed = true;
      }
    },
  },
});

export const { setFiles, addFile, removeFile, renameFile, trashFile } =
  fileSlice.actions;
export default fileSlice.reducer;
