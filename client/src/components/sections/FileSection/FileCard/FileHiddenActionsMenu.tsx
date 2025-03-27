"use client";
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
      <div
        className=" px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
        onClick={() => handleChangeFileName(file)}
      >
        <PenLine />
      </div>
      {file.isTrashed && (
        <div
          className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
          onClick={() => handleRestore(file)}
        >
          <ArchiveRestore />
        </div>
      )}

      <div
        className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
        onClick={() => handleFavorite(file)}
      >
        {file.isFavorite ? <StarOff /> : <Star />}
      </div>
      <div
        className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
        onClick={() => handleIsHidden(file)}
      >
        {file.isHidden ? <Eye /> : <EyeOff />}
      </div>
    </div>
  );
};

export default FileHiddenActionsMenu;
