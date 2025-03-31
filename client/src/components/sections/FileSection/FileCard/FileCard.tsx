"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { UserFile } from "@/lib/types/file";
import FileActionsMenu from "./FileActionsMenu";
import FileHiddenActionsMenu from "./FileHiddenActionsMenu";
import useFileCardActions from "@/hooks/use-file-card-actions";
import FileNameCell from "@/components/ui/FileNameCell";
import FileDateCell from "@/components/ui/FileDateCell";
import FileSizeCell from "@/components/ui/FileSizeCell";
import FileExtensionCell from "@/components/ui/FileExtensionCell";
import useFileHandlers from "@/hooks/use-file-handlers";
import useDragAndDropFiles from "@/hooks/use-drag-and-drop-files";
import { useState } from "react";
import { cn } from "@/lib/utils/utils";

interface FileCardProps {
  file: UserFile;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    isHiddenActionsMenuVisible,
    isMenuOpen,
    setIsMenuOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleContextMenu,
  } = useFileCardActions();

  const { handleFileClick, handleFolderClick } = useFileHandlers();

  const { handleDragStart, handleDragEnd, handleDrop, draggedFileId } =
    useDragAndDropFiles();

  return (
    <>
      <TableRow
        key={file.id}
        onDoubleClick={() => {
          return file.type === "CATALOG"
            ? handleFolderClick(file)
            : handleFileClick(file);
        }}
        draggable={!file.isTrashed}
        onDragStart={(e: React.DragEvent<HTMLTableRowElement>) =>
          handleDragStart(e, file)
        }
        onDragEnd={handleDragEnd}
        onDrop={() => {
          setIsDragOver(false);
          handleDrop(file);
        }}
        onDragOver={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
        className={cn(
          isDragOver ? "dark:bg-neutral-900 bg-slate-200" : "",
          isDragOver && draggedFileId === file.id
            ? "opacity-75"
            : "opacity-100",
          "transition-all duration-200"
        )}
      >
        <TableCell className="max-w-[200px]">
          <FileNameCell file={file} />
        </TableCell>
        <TableCell>
          <FileDateCell date={file.modifiedAt} />
        </TableCell>
        <TableCell>
          <FileSizeCell file={file} />
        </TableCell>
        <TableCell>
          <FileExtensionCell file={file} />
        </TableCell>
        <TableCell>
          <FileHiddenActionsMenu
            file={file}
            isHidden={isHiddenActionsMenuVisible}
          />
        </TableCell>
        <TableCell className="text-right">
          <FileActionsMenu
            file={file}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

export default FileCard;
