"use client";
import FileTrasher from "@/components/sections/FileSection/FileTrasher/FileTrasher";
import ModalWrapper from "@/components/sections/FileSection/ModalWrapper";
import LoadingSpinner from "@/components/sections/LoadingSpinner/LoadingSpinner";
import { useModal } from "@/hooks/use-modal";
import { lazy, Suspense } from "react";
import SearchCommand from "../SearchCommand/SearchCommand";

const FileUploader = lazy(
  () => import("@/components/sections/FileSection/FileUploader/FileUploader")
);

const CatalogUploader = lazy(
  () =>
    import("@/components/sections/FileSection/CatalogUploader/CatalogUploader")
);

const FileRenamer = lazy(
  () => import("@/components/sections/FileSection/FileRenamer/FileRenamer")
);

const ModalRoot = () => {
  const { isOpen, modalType } = useModal();

  if (!isOpen) return;

  return (
    <div id="modal-root">
      <ModalWrapper>
        <Suspense fallback={<LoadingSpinner />}>
          {modalType == "FileUploader" && <FileUploader />}
          {modalType == "CatalogUploader" && <CatalogUploader />}
          {modalType == "FileNameChanger" && <FileRenamer />}
          {modalType == "FileTrasher" && <FileTrasher />}
          {modalType == "Searchbar" && <SearchCommand />}
        </Suspense>
      </ModalWrapper>
    </div>
  );
};

export default ModalRoot;
