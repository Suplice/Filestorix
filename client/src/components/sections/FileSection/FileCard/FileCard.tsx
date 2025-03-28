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

interface FileCardProps {
  file: UserFile;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const {
    isHiddenActionsMenuVisible,
    isMenuOpen,
    setIsMenuOpen,
    handleMouseEnter,
    handleMouseLeave,
    handleContextMenu,
  } = useFileCardActions();

  const { handleFileClick, handleFolderClick } = useFileHandlers();

  return (
    <TableRow
      key={file.id}
      onDoubleClick={() => {
        return file.type === "CATALOG"
          ? handleFolderClick(file)
          : handleFileClick(file);
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
          handleFolderClick={handleFolderClick}
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
        />
      </TableCell>
    </TableRow>
  );
};

export default FileCard;
