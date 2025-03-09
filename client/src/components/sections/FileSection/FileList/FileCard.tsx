"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Folder } from "lucide-react";
import { UserFile } from "@/lib/types/file";
import { useMemo } from "react";
import { useModal } from "@/hooks/use-modal";
import { TableCell, TableRow } from "@/components/ui/table";

interface FileCardProps {
  handleFolderClick: (fileId: number, catalogName: string) => void;
  file: UserFile;
}

const FileCard: React.FC<FileCardProps> = ({ file, handleFolderClick }) => {
  const { showModal } = useModal();

  const formatSize = useMemo(() => {
    if (file.size < 1024) return `${file.size} B`;
    if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(2)} KB`;
    if (file.size < 1024 * 1024 * 1024)
      return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }, [file.size]);

  return (
    <TableRow
      key={file.id}
      onDoubleClick={() => handleFolderClick(file.id, file.name)}
    >
      <TableCell className="">
        <div className="flex flex-row gap-3">
          {file.type === "CATALOG" ? (
            <Folder className="h-5 w-5 text-yellow-500" />
          ) : (
            <FileText className="h-5 w-5 text-blue-500" />
          )}
          <span
            className="font-medium cursor-pointer"
            onClick={() => handleFolderClick(file.id, file.name)}
          >
            {file.name}
          </span>
        </div>
      </TableCell>
      <TableCell>{formatSize}</TableCell>
      <TableCell className="capitalize">{file.type.toLowerCase()}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleFolderClick(file.id, file.name)}
            >
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => showModal("FileNameChanger", { fileId: file.id })}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => showModal("FileTrasher", { fileId: file.id })}
            >
              Trash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default FileCard;
