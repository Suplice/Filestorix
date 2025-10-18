"use client";
import ModalWrapper from "@/components/ui/modalWrapper";
import LoadingSpinner from "@/components/sections/LoadingSpinner/LoadingSpinner";
import RightSidebarModalWrapper from "@/components/sections/SettingsSection/RightSidebarModalWrapper";

import { useModal } from "@/hooks/use-modal";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import SearchCommandBody from "../SearchCommand/searchCommandBody";

const SettingsModal = lazy(
  () => import("@/components/sections/SettingsSection/SettingsModal")
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
