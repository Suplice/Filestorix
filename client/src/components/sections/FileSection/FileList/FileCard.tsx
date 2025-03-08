"use client";
import { Card } from "@/components/ui/card";
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

const FileCard = ({ file }: { file: UserFile }) => {
  const { showModal } = useModal();

  const formatSize = useMemo(() => {
    if (file.size < 1024) return `${file.size} B`;
    if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(2)} KB`;
    if (file.size < 1024 * 1024 * 1024)
      return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }, [file.size]);

  return (
    <Card className="grid grid-cols-4 items-center gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        {file.type === "CATALOG" ? (
          <Folder className="h-5 w-5 text-yellow-500" />
        ) : (
          <FileText className="h-5 w-5 text-blue-500" />
        )}
        <span>{file.name}</span>
      </div>
      <span>{formatSize}</span>
      <span className="capitalize">{file.type.toLowerCase()}</span>
      <div className="flex items-center justify-between">
        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Open", file.name)}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => showModal("FileNameChanger", { fileId: file.id })}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Delete", file.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default FileCard;
