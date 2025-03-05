"use client";
import { useModal } from "@/hooks/use-modal";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
  const { hideModal } = useModal();

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    hideModal();
  };

  return createPortal(
    <div
      className="w-full h-full flex items-center justify-center pointer-events-auto backdrop-brightness-[0.3]"
      onClick={handleBackdropClick}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative">
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default ModalPortal;
