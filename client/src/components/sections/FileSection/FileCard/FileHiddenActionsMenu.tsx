"use client";
import TooltipBox from "@/components/ui/tooltipBox";
import useFileHandlers from "@/hooks/use-file-handlers";
import { UserFile } from "@/lib/types/file";
import {
  ArchiveRestore,
  Eye,
  EyeOff,
  PenLine,
  Star,
  StarOff,
} from "lucide-react";

interface FileHiddenActionsMenuProps {
  file: UserFile;
  isHidden: boolean;
}

const FileHiddenActionsMenu: React.FC<FileHiddenActionsMenuProps> = ({
  file,
  isHidden,
}) => {
  const {
    handleFavorite,
    handleChangeFileName,
    handleIsHidden,
    handleRestore,
  } = useFileHandlers();

  return (
    <div
      className={`transition-opacity duration-200 flex flex-row gap-2  ${
        isHidden ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <TooltipBox message="Rename">
        <div
          className=" px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
          onClick={() => handleChangeFileName(file)}
        >
          <PenLine />
        </div>
      </TooltipBox>
      {file.isTrashed && (
        <TooltipBox message="Restore">
          <div
            className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
            onClick={() => handleRestore(file)}
          >
            <ArchiveRestore />
          </div>
        </TooltipBox>
      )}

      <TooltipBox
        message={file.isFavorite ? "remove favorite mark" : "Mark as favorite"}
      >
        <div
          className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
          onClick={() => handleFavorite(file)}
        >
          {file.isFavorite ? <StarOff /> : <Star />}
        </div>
      </TooltipBox>
      <TooltipBox message={file.isHidden ? "Hide file" : "Reveal file"}>
        <div
          className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
          onClick={() => handleIsHidden(file)}
        >
          {file.isHidden ? <Eye /> : <EyeOff />}
        </div>
      </TooltipBox>
    </div>
  );
};

export default FileHiddenActionsMenu;
