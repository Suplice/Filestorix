"use client";
import { UserFile } from "@/lib/types/file";
import { setDraggedFileId, setIsDraggingFile } from "@/store/fileSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import useFileActions from "./use-file-actions";

const useDragAndDropFiles = () => {
  const dispatch = useDispatch();

  const { moveFile } = useFileActions();

  const isDraggingFile = useSelector(
    (store: RootState) => store.file.isDraggingFile
  );

  const draggedFileId = useSelector(
    (store: RootState) => store.file.draggedFileId
  );

  const handleDragStart = (file: UserFile) => {
    dispatch(setIsDraggingFile(true));
    dispatch(setDraggedFileId(file.id));
  };

  const handleDragEnd = () => {
    dispatch(setIsDraggingFile(false));
    dispatch(setDraggedFileId(undefined));
  };

  const handleDrop = (file: UserFile) => {
    dispatch(setIsDraggingFile(false));
    dispatch(setDraggedFileId(undefined));
    if (
      draggedFileId !== undefined &&
      file.id !== draggedFileId &&
      file.type !== "FILE"
    )
      moveFile({ fileId: draggedFileId, newParentId: file.id });
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDrop,
    setIsDraggingFile,
    isDraggingFile,
    draggedFileId,
  };
};

export default useDragAndDropFiles;
