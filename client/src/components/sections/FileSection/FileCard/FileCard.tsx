"use client";

import { useMemo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserFile } from "@/lib/types/file";
import { useModal } from "@/hooks/use-modal";
import FileActionsMenu from "./FileActionsMenu";
import FileHiddenActionsMenu from "./FileHiddenActionsMenu";
import useFileCardActions from "@/hooks/use-file-card-actions";
import FileNameCell from "@/components/ui/FileNameCell";

interface FileCardProps {
  handleFolderClick: (fileId: number, catalogName: string) => void;
  file: UserFile;
}

const FileCard: React.FC<FileCardProps> = ({ file, handleFolderClick }) => {
  const { showModal } = useModal();

  const {
    isHiddenActionsMenuVisible,
    isMenuOpen,
    setIsMenuOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleContextMenu,
  } = useFileCardActions();

  const formatSize = useMemo(() => {
    if (file.size < 1024) return `${file.size} B`;
    if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(2)} KB`;
    if (file.size < 1024 * 1024 * 1024)
      return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }, [file.size]);

  const handleFileClick = () => {
    showModal("FilePreview", { fileName: file.id + file.extension });
  };

  return (
    <TableRow
      key={file.id}
      onDoubleClick={() => {
        return file.type === "CATALOG"
          ? handleFolderClick(file.id, file.name)
          : handleFileClick();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    >
      <TableCell className="max-w-[200px]">
        <FileNameCell
          file={file}
          handleFileClick={handleFileClick}
          handleFolderClick={handleFolderClick}
        />
      </TableCell>
      <TableCell>{new Date(file.modifiedAt).toLocaleString()}</TableCell>
      <TableCell>{file.type === "CATALOG" ? "-" : formatSize}</TableCell>
      <TableCell className="capitalize">
        {file.extension.toUpperCase().substring(1)}
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
          handleFolderClick={handleFolderClick}
          handleFileClick={handleFileClick}
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
        />
      </TableCell>
    </TableRow>
  );
};

export default FileCard;
