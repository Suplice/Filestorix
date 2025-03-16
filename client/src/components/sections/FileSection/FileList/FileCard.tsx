"use client";

import { useMemo } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserFile } from "@/lib/types/file";
import { useModal } from "@/hooks/use-modal";
import FileIcon from "./FileIcon";
import FileActionsMenu from "./FileActionsMenu";

interface FileCardProps {
  handleClick: (fileId: number, catalogName: string) => void;
  file: UserFile;
}

const FileCard: React.FC<FileCardProps> = ({ file, handleClick }) => {
  const { showModal } = useModal();

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
    >
      <TableCell>
        <div className="flex flex-row gap-3 items-center">
          <FileIcon extension={file.extension} />
          <span
            className={`font-medium cursor-pointer ${
              file.isHidden ? "text-gray-500" : ""
            }`}
            onClick={() =>
              file.type === "CATALOG"
                ? handleClick(file.id, file.name)
                : handleFileClick()
            }
          >
            {file.name}
          </span>
        </div>
      </TableCell>
      <TableCell>{file.type === "CATALOG" ? "" : formatSize}</TableCell>
      <TableCell className="capitalize">
        {file.extension.toUpperCase().substring(1)}
      </TableCell>
      <TableCell className="text-right">
        <FileActionsMenu
          file={file}
          handleClick={handleClick}
          handleFileClick={handleFileClick}
        />
      </TableCell>
    </TableRow>
  );
};

export default FileCard;
