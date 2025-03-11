"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { UserFile } from "@/lib/types/file";

interface FileActionsMenuProps {
  file: UserFile;
  handleClick: (fileId: number, catalogName: string) => void;
  handleFileClick: () => void;
}

const FileActionsMenu: React.FC<FileActionsMenuProps> = ({
  file,
  handleClick,
  handleFileClick,
}) => {
  const { showModal } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            file.type === "CATALOG"
              ? handleClick(file.id, file.name)
              : handleFileClick()
          }
        >
          Open
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => showModal("FileNameChanger", { fileId: file.id })}
        >
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            file.isTrashed
              ? showModal("FileRemover", { fileId: file.id })
              : showModal("FileTrasher", { fileId: file.id })
          }
        >
          {file.isTrashed ? "Delete" : "Trash"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileActionsMenu;
