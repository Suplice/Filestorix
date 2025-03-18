"use client";
import ModalWrapper from "@/components/sections/FileSection/ModalWrapper";
import LoadingSpinner from "@/components/sections/LoadingSpinner/LoadingSpinner";
import { useModal } from "@/hooks/use-modal";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const FileUploader = dynamic(
  () => import("@/components/sections/FileSection/FileUploader/FileUploader"),
  { ssr: false }
);

const CatalogUploader = dynamic(
  () =>
    import("@/components/sections/FileSection/CatalogUploader/CatalogUploader"),
  { ssr: false }
);

const FileRenamer = dynamic(
  () => import("@/components/sections/FileSection/FileRenamer/FileRenamer"),
  { ssr: false }
);

const FileTrasher = dynamic(
  () => import("@/components/sections/FileSection/FileTrasher/FileTrasher"),
  { ssr: false }
);

const FilePreview = dynamic(
  () => import("@/components/sections/FileSection/FilePreview/FilePreview"),
  { ssr: false }
);

const FileRemover = dynamic(
  () => import("@/components/sections/FileSection/FileRemover/FileRemover"),
  { ssr: false }
);

const CatalogTrasher = dynamic(
  () =>
    import("@/components/sections/FileSection/CatalogTrasher/CatalogTrasher"),
  { ssr: false }
);

const CatalogRemover = dynamic(
  () =>
    import("@/components/sections/FileSection/CatalogRemover/CatalogRemover"),
  { ssr: false }
);

const FileRestore = dynamic(
  () => import("@/components/sections/FileSection/FileRestore/FileRestore"),
  { ssr: false }
);

const SettingsModal = dynamic(
  () => import("@/components/sections/SettingsSection/SettingsModal"),
  { ssr: false }
);

const FileDetails = dynamic(
  () => import("@/components/sections/FileSection/FileDetails/FileDetails"),
  { ssr: false }
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
          {modalType == "FilePreview" && <FilePreview />}
          {modalType == "FileRemover" && <FileRemover />}
          {modalType == "CatalogRemover" && <CatalogRemover />}
          {modalType == "CatalogTrasher" && <CatalogTrasher />}
          {modalType == "FileRestorer" && <FileRestore />}
          {modalType == "Settings" && <SettingsModal />}
          {modalType == "Details" && <FileDetails />}
        </Suspense>
      </ModalWrapper>
    </div>
  );
};

export default ModalRoot;
