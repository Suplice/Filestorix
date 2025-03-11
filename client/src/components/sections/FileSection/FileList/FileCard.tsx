"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIconMap, UserFile } from "@/lib/types/file";
import { useMemo } from "react";
import { useModal } from "@/hooks/use-modal";
import { TableCell, TableRow } from "@/components/ui/table";

import {
  FileText,
  FileImage,
  File,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Folder,
  MoreVertical,
} from "lucide-react";

const fileIcons: FileIconMap = {
  ".xlsx": { icon: FileSpreadsheet, color: "text-green-500" },
  ".csv": { icon: FileSpreadsheet, color: "text-green-500" },
  ".pdf": { icon: File, color: "text-red-500" },
  ".png": { icon: FileImage, color: "text-blue-500" },
  ".jpg": { icon: FileImage, color: "text-blue-500" },
  ".jpeg": { icon: FileImage, color: "text-blue-500" },
  ".txt": { icon: FileText, color: "text-gray-500" },
  ".zip": { icon: FileArchive, color: "text-yellow-500" },
  ".rar": { icon: FileArchive, color: "text-yellow-500" },
  ".json": { icon: FileCode, color: "text-purple-500" },
  ".xml": { icon: FileCode, color: "text-purple-500" },
  "": { icon: Folder, color: "text-yellow-500" },
};

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

  const { icon: Icon, color } = fileIcons[file.extension] || {
    icon: File,
    color: "text-muted-foreground",
  };

  return (
    <TableRow
      key={file.id}
      onDoubleClick={() => {
        if (file.type === "CATALOG") {
          handleClick(file.id, file.name);
        } else {
          handleFileClick();
        }
      }}
    >
      <TableCell className="">
        <div className="flex flex-row gap-3">
          <Icon className={`h-5 w-5 ${color}`} />
          <span
            className="font-medium cursor-pointer"
            onClick={() => {
              if (file.type === "CATALOG") {
                handleClick(file.id, file.name);
              } else {
                handleFileClick();
              }
            }}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                if (file.type === "CATALOG") {
                  handleClick(file.id, file.name);
                } else {
                  handleFileClick();
                }
              }}
            >
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => showModal("FileNameChanger", { fileId: file.id })}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                return file.isTrashed
                  ? showModal("FileRemover", { fileId: file.id })
                  : showModal("FileTrasher", { fileId: file.id });
              }}
            >
              {file.isTrashed ? "Delete" : "Trash"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default FileCard;
