import { UserFile } from "@/lib/types/file";
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
  },
});

export const { setFiles, addFile, removeFile } = fileSlice.actions;
export default fileSlice.reducer;
