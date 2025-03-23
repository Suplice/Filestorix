"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveRestore,
  ArrowUpLeft,
  Delete,
  Eye,
  EyeOff,
  FolderOpen,
  Info,
  MoreVertical,
  PenLine,
  Star,
  StarOff,
  Trash,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { UserFile } from "@/lib/types/file";
import useFileActions from "@/hooks/use-file-actions";

interface FileActionsMenuProps {
  file: UserFile;
  handleClick: (fileId: number, catalogName: string) => void;
  handleFileClick: () => void;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const FileActionsMenu: React.FC<FileActionsMenuProps> = ({
  file,
  handleClick,
  handleFileClick,
  isOpen,
  setIsOpen,
}) => {
  const { showModal } = useModal();

  const { addFavoriteFile, removeFavoriteFile, hideFile, revealFile } =
    useFileActions();

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

  const handleHide = () => {
    if (file.isHidden) {
      revealFile({ fileId: file.id });
    } else {
      hideFile({ fileId: file.id });
    }
  };

  const handleOpenFileDetails = () => {
    showModal("Details", { fileId: file.id });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="left">
        <DropdownMenuItem
          onClick={() =>
            file.type === "CATALOG"
              ? handleClick(file.id, file.name)
              : handleFileClick()
          }
        >
          <>
            {file.type === "CATALOG" ? <FolderOpen /> : <ArrowUpLeft />}
            <p>Open</p>
          </>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {!file.isTrashed && (
          <>
            {file.type !== "CATALOG" && (
              <DropdownMenuItem onClick={handleFavorite}>
                {file.isFavorite ? (
                  <>
                    <StarOff />
                    <p>Unfavorite</p>
                  </>
                ) : (
                  <>
                    <Star />
                    <p>Favorite</p>
                  </>
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => showModal("FileNameChanger", { fileId: file.id })}
            >
              <PenLine />
              <p>Rename</p>
            </DropdownMenuItem>
          </>
        )}

        {file.type !== "CATALOG" && (
          <DropdownMenuItem onClick={handleHide}>
            {file.isHidden ? (
              <>
                <Eye />
                <p>Reveal</p>
              </>
            ) : (
              <>
                <EyeOff />
                <p>Hide</p>
              </>
            )}
          </DropdownMenuItem>
        )}

        {file.isTrashed && (
          <DropdownMenuItem onClick={handleRestore}>
            <ArchiveRestore />
            <p>Restore</p>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={handleTrashOrDelete}
          className="text-red-500"
        >
          {file.isTrashed ? (
            <>
              <Delete />
              <p>Delete</p>
            </>
          ) : (
            <>
              <Trash />
              <p>Trash</p>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleOpenFileDetails}>
          <Info />
          <p>Details</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileActionsMenu;
