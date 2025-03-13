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
import useFileActions from "@/hooks/use-file-actions";

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

  const { addFavoriteFile, removeFavoriteFile } = useFileActions();

  const handleTrashOrDelete = () => {
    if (file.type === "CATALOG") {
      if (file.isTrashed) {
        showModal("CatalogRemover", { fileId: file.id });
      } else {
        showModal("CatalogTrasher", { fileId: file.id });
      }
    } else {
      if (file.isTrashed) {
        showModal("FileRemover", { fileId: file.id });
      } else {
        showModal("FileTrasher", { fileId: file.id });
      }
    }
  };

  const handleRestore = () => {
    showModal("FileRestorer", { fileId: file.id, parentId: file.parentId });
  };

  const handleFavorite = () => {
    if (file.isFavorite) {
      removeFavoriteFile({ fileId: file.id });
    } else {
      addFavoriteFile({ fileId: file.id });
    }
  };

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

        {!file.isTrashed && (
          <>
            {file.type !== "CATALOG" && (
              <DropdownMenuItem onClick={handleFavorite}>
                {file.isFavorite ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => showModal("FileNameChanger", { fileId: file.id })}
            >
              Rename
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={handleTrashOrDelete}>
          {file.isTrashed ? "Delete" : "Trash"}
        </DropdownMenuItem>
        {file.isTrashed && (
          <DropdownMenuItem onClick={handleRestore}>Restore</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileActionsMenu;
