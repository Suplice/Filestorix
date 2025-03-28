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
import { UserFile } from "@/lib/types/file";
import useFileHandlers from "@/hooks/use-file-handlers";

interface FileActionsMenuProps {
  file: UserFile;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const FileActionsMenu: React.FC<FileActionsMenuProps> = ({
  file,
  isOpen,
  setIsOpen,
}) => {
  const {
    handleTrashOrDelete,
    handleRestore,
    handleFavorite,
    handleIsHidden,
    handleOpenFileDetails,
    handleChangeFileName,
    handleFileClick,
    handleFolderClick,
  } = useFileHandlers();

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
              ? handleFolderClick(file)
              : handleFileClick(file)
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
              <DropdownMenuItem onClick={() => handleFavorite(file)}>
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
            <DropdownMenuItem onClick={() => handleChangeFileName(file)}>
              <PenLine />
              <p>Rename</p>
            </DropdownMenuItem>
          </>
        )}

        {file.type !== "CATALOG" && (
          <DropdownMenuItem onClick={() => handleIsHidden(file)}>
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
          <DropdownMenuItem onClick={() => handleRestore(file)}>
            <ArchiveRestore />
            <p>Restore</p>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => handleTrashOrDelete(file)}
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

        <DropdownMenuItem onClick={() => handleOpenFileDetails(file)}>
          <Info />
          <p>Details</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileActionsMenu;
