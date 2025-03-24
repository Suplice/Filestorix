"use client";
import ModalWrapper from "@/components/sections/FileSection/ModalWrapper";
import LoadingSpinner from "@/components/sections/LoadingSpinner/LoadingSpinner";
import RightSidebarModalWrapper from "@/components/sections/SettingsSection/RightSidebarModalWrapper";

import { useModal } from "@/hooks/use-modal";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import SearchCommandBody from "../SearchCommand/searchCommandBody";

const FileUploader = lazy(
  () => import("@/components/sections/FileSection/FileUploader")
);

const CatalogUploader = lazy(
  () => import("@/components/sections/FileSection/CatalogUploader")
);

const FileRenamer = lazy(
  () => import("@/components/sections/FileSection/FileRenamer")
);

const FileTrasher = lazy(
  () => import("@/components/sections/FileSection/FileTrasher")
);

const FilePreview = lazy(
  () => import("@/components/sections/FileSection/FilePreview")
);

const FileRemover = lazy(
  () => import("@/components/sections/FileSection/FileRemover")
);

const CatalogTrasher = lazy(
  () => import("@/components/sections/FileSection/CatalogTrasher")
);

const CatalogRemover = lazy(
  () => import("@/components/sections/FileSection/CatalogRemover")
);

const FileRestore = lazy(
  () => import("@/components/sections/FileSection/FileRestore")
);

const SettingsModal = lazy(
  () => import("@/components/sections/SettingsSection/SettingsModal")
);

const FileDetails = lazy(
  () => import("@/components/sections/FileSection/FileDetails/FileDetails")
);

const ModalRoot = () => {
  const { isOpen, modalType } = useModal();

  return (
    <div id="modal-root">
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {modalType === "Settings" ? (
              <RightSidebarModalWrapper>
                <Suspense fallback={<LoadingSpinner />}>
                  <SettingsModal />
                </Suspense>
              </RightSidebarModalWrapper>
            ) : (
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
                  {modalType == "Details" && <FileDetails />}
                  {modalType == "SearchBox" && <SearchCommandBody />}
                </Suspense>
              </ModalWrapper>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModalRoot;
