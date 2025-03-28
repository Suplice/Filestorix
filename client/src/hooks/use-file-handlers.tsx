import { UserFile } from "@/lib/types/file";
import { useModal } from "./use-modal";
import useFileActions from "./use-file-actions";
import { useDispatch, useSelector } from "react-redux";
import { setParentId, setRoute } from "@/store/locationSlice";
import { RootState } from "@/store/store";

const useFileHandlers = () => {
  const { showModal } = useModal();

  const dispatch = useDispatch();

  const route = useSelector((state: RootState) => state.location.route);

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

  const handleFolderClick = (file: UserFile) => {
    if (file.type === "CATALOG") {
      dispatch(setParentId({ parentId: file.id }));
      dispatch(
        setRoute({
          route: [...route, { sectionName: file.name, catalogId: file.id }],
        })
      );
    }
  };

  const handleChangeRoute = (catalogId: number | null) => {
    dispatch(setParentId({ parentId: catalogId }));
    const newRouteIndex = route.findIndex(
      (route) => route.catalogId === catalogId
    );
    dispatch(
      setRoute({
        route: route.slice(0, newRouteIndex + 1),
      })
    );
  };

  return {
    handleFileClick,
    handleTrashOrDelete,
    handleRestore,
    handleFavorite,
    handleIsHidden,
    handleOpenFileDetails,
    handleChangeFileName,
    handleFolderClick,
    handleChangeRoute,
  };
};

export default useFileHandlers;
