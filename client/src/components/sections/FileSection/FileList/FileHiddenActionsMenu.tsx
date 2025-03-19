"use client";
import useFileActions from "@/hooks/use-file-actions";
import { useModal } from "@/hooks/use-modal";
import { UserFile } from "@/lib/types/file";
import { Eye, EyeOff, PenLine, Star, StarOff } from "lucide-react";

interface FileHiddenActionsMenuProps {
  file: UserFile;
  isHidden: boolean;
}

const FileHiddenActionsMenu: React.FC<FileHiddenActionsMenuProps> = ({
  file,
  isHidden,
}) => {
  const { showModal } = useModal();

  const { addFavoriteFile, removeFavoriteFile, hideFile, revealFile } =
    useFileActions();

  if (!isHidden) {
    return <></>;
  }

  const handleStarClick = () => {
    if (file.isFavorite) {
      removeFavoriteFile({ fileId: file.id });
    } else {
      addFavoriteFile({ fileId: file.id });
    }
  };

  const handlePenClick = () => {
    showModal("FileNameChanger", { fileId: file.id });
  };

  const handleShowClick = () => {
    if (file.isHidden) {
      revealFile({ fileId: file.id });
    } else {
      hideFile({ fileId: file.id });
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <div
        className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
        onClick={handlePenClick}
      >
        <PenLine />
      </div>
      <div
        className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
        onClick={handleStarClick}
      >
        {file.isFavorite ? <StarOff /> : <Star />}
      </div>
      <div
        className="px-2 py-1 hover:brightness-50 cursor-pointer brightness-75"
        onClick={handleShowClick}
      >
        {file.isHidden ? <Eye /> : <EyeOff />}
      </div>
    </div>
  );
};

export default FileHiddenActionsMenu;
