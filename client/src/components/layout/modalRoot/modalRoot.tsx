"use client";
import ModalWrapper from "@/components/sections/FileSection/ModalWrapper";
import LoadingSpinner from "@/components/sections/loadingSpinner/loadingSpinner";
import { useModal } from "@/hooks/use-modal";
import { lazy, Suspense } from "react";

const FileUploader = lazy(
  () => import("@/components/sections/FileSection/FileAdder/FileUploader")
);

const CatalogUploader = lazy(
  () =>
    import("@/components/sections/FileSection/CatalogUploader/CatalogUploader")
);

const ModalRoot = () => {
  const { isOpen, modalType } = useModal();

  if (!isOpen) return;

  return (
    <div>
      <ModalWrapper>
        <Suspense fallback={<LoadingSpinner />}>
          {modalType == "addFile" && <FileUploader />}
          {modalType == "addFolder" && <CatalogUploader />}
        </Suspense>
      </ModalWrapper>
    </div>
  );
};

export default ModalRoot;
