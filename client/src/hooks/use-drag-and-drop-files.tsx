import { UserFile } from "@/lib/types/file";
import { setDraggedFileId, setIsDraggingFile } from "@/store/fileSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import useFileActions from "./use-file-actions";

const useDragAndDropFiles = () => {
  const dispatch = useDispatch();
  const { moveFile } = useFileActions();

  const routes = useSelector((store: RootState) => store.location.route);
  const isDraggingFile = useSelector(
    (store: RootState) => store.file.isDraggingFile
  );
  const draggedFileId = useSelector(
    (store: RootState) => store.file.draggedFileId
  );

  let ghostImage: HTMLDivElement | null = null;

  const handleDragStart = (
    event: React.DragEvent<HTMLTableRowElement>,
    file: UserFile
  ) => {
    dispatch(setIsDraggingFile(true));
    dispatch(setDraggedFileId(file.id));

    ghostImage = document.createElement("div");
    ghostImage.id = "ghostImage";
    ghostImage.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center;">
    <span style="font-size: 20px; margin-right: 8px;">${
      file.type === "CATALOG" ? "📂" : "📄"
    }</span>
    ${file.name}
  </div>
`;

    document.body.appendChild(ghostImage);

    event.dataTransfer.setDragImage(ghostImage, 0, 55);
  };

  const handleDragEnd = () => {
    dispatch(setIsDraggingFile(false));
    dispatch(setDraggedFileId(undefined));

    if (ghostImage) {
      document.body.removeChild(ghostImage);
    }
  };

  const handleDrop = (file: UserFile) => {
    dispatch(setIsDraggingFile(false));
    dispatch(setDraggedFileId(undefined));

    if (
      draggedFileId !== undefined &&
      file.id !== draggedFileId &&
      file.type !== "FILE"
    ) {
      moveFile({ fileId: draggedFileId, newParentId: file.id });
    }

    if (ghostImage) {
      document.body.removeChild(ghostImage);
    }
  };

  const handleRouteDrop = (catalogId: number | null) => {
    dispatch(setIsDraggingFile(false));
    dispatch(setDraggedFileId(undefined));

    if (routes[routes.length - 1].catalogId === catalogId) {
      return;
    }

    if (draggedFileId !== undefined && catalogId !== draggedFileId) {
      moveFile({ fileId: draggedFileId, newParentId: catalogId });
    }

    if (ghostImage) {
      document.body.removeChild(ghostImage);
    }
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDrop,
    setIsDraggingFile,
    isDraggingFile,
    draggedFileId,
    handleRouteDrop,
  };
};

export default useDragAndDropFiles;
