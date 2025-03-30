import { RenameFileResult, UserFile, TrashFileResult } from "@/lib/types/file";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileState {
  files: UserFile[];
  isDraggingFile: boolean;
  draggedFileId: number | undefined;
  draggedFileInfo?: { name: string; type: "FILE" | "CATALOG" } | null;
}

const initialState: FileState = {
  files: [],
  isDraggingFile: false,
  draggedFileId: undefined,
  draggedFileInfo: null,
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
    setIsDraggingFile: (state, action: PayloadAction<boolean>) => {
      state.isDraggingFile = action.payload;
    },
    setDraggedFileId: (state, action: PayloadAction<number | undefined>) => {
      state.draggedFileId = action.payload;
    },
    setDraggedFileInfo: (
      state,
      action: PayloadAction<{ name: string; type: "FILE" | "CATALOG" } | null>
    ) => {
      state.draggedFileInfo = action.payload;
    },
  },
});

export const {
  setFiles,
  addFile,
  removeFile,
  renameFile,
  trashFile,
  setIsDraggingFile,
  setDraggedFileId,
  setDraggedFileInfo,
} = fileSlice.actions;
export default fileSlice.reducer;
