"use client";

import { useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserFile } from "@/lib/types/file";
import { useModal } from "@/hooks/use-modal";
import FileIcon from "./FileIcon";
import FileActionsMenu from "./FileActionsMenu";
import FileHiddenActionsMenu from "./FileHiddenActionsMenu";
import { Star } from "lucide-react";

interface FileCardProps {
  handleClick: (fileId: number, catalogName: string) => void;
  file: UserFile;
}

const FileCard: React.FC<FileCardProps> = ({ file, handleClick }) => {
  const { showModal } = useModal();
  const [isHiddenActionsMenuVisible, setIsHiddenActionsMenuVisible] =
    useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          ? handleClick(file.id, file.name)
          : handleFileClick();
      }}
      onMouseEnter={() => setIsHiddenActionsMenuVisible(true)}
      onMouseLeave={() => setIsHiddenActionsMenuVisible(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsMenuOpen(true);
      }}
    >
      <TableCell className="max-w-[200px]">
        <div className="flex flex-row gap-3 items-center">
          <FileIcon extension={file.extension} />
          <span
            className={`font-medium cursor-pointer truncate flex flex-row items-center gap-2 ${
              file.isHidden ? "text-gray-500" : ""
            }`}
            onClick={() =>
              file.type === "CATALOG"
                ? handleClick(file.id, file.name)
                : handleFileClick()
            }
          >
            {file.name}
            {file.isFavorite && <Star className="w-4 h-4" />}
          </span>
        </div>
      </TableCell>
      <TableCell>{new Date(file.modifiedAt).toLocaleString()}</TableCell>
      <TableCell>{file.type === "CATALOG" ? "" : formatSize}</TableCell>
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
          handleClick={handleClick}
          handleFileClick={handleFileClick}
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
        />
      </TableCell>
    </TableRow>
  );
};

export default FileCard;
