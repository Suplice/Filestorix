import { UserFile } from "@/lib/types/file";
import { useModal } from "./use-modal";
import useFileActions from "./use-file-actions";

const useFileHandlers = () => {
  const { showModal } = useModal();

  const { addFavoriteFile, removeFavoriteFile, hideFile, revealFile } =
    useFileActions();

  const handleFileClick = (file: UserFile) => {
    showModal("FilePreview", { fileName: file.id + file.extension });
  };

  const handleTrashOrDelete = (file: UserFile) => {
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

  const handleRestore = (file: UserFile) => {
    showModal("FileRestorer", { fileId: file.id, parentId: file.parentId });
  };

  const handleFavorite = (file: UserFile) => {
    if (file.isFavorite) {
      removeFavoriteFile({ fileId: file.id });
    } else {
      addFavoriteFile({ fileId: file.id });
    }
  };

  const handleIsHidden = (file: UserFile) => {
    if (file.isHidden) {
      revealFile({ fileId: file.id });
    } else {
      hideFile({ fileId: file.id });
    }
  };

  const handleOpenFileDetails = (file: UserFile) => {
    showModal("Details", { fileId: file.id });
  };

  const handleChangeFileName = (file: UserFile) => {
    showModal("FileNameChanger", { fileId: file.id });
  };

  return {
    handleFileClick,
    handleTrashOrDelete,
    handleRestore,
    handleFavorite,
    handleIsHidden,
    handleOpenFileDetails,
    handleChangeFileName,
  };
};

export default useFileHandlers;
