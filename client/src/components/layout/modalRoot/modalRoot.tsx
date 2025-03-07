"use client";
import LoadingSpinner from "@/components/sections/loadingSpinner/loadingSpinner";
import { useModal } from "@/hooks/use-modal";
import { lazy, Suspense } from "react";

const FileUploaderWrapper = lazy(
  () => import("@/components/sections/FileSection/FileAdder/Wrapper")
);

const CatalogUploaderWrapper = lazy(
  () => import("@/components/sections/FileSection/CatalogUploader/Wrapper")
);

const ModalRoot = () => {
  const { isOpen, modalType } = useModal();

  return (
    <div id="modal-root">
      <Suspense fallback={<LoadingSpinner />}>
        {isOpen && modalType == "addFile" && <FileUploaderWrapper />}
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        {isOpen && modalType == "addFolder" && <CatalogUploaderWrapper />}
      </Suspense>
    </div>
  );
};

export default ModalRoot;
