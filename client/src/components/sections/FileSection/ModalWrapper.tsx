"use client";
import { useModal } from "@/hooks/use-modal";

interface ModalWrapperProps {
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children }) => {
  const { hideModal } = useModal();

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    hideModal();
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center pointer-events-auto backdrop-brightness-[0.3]"
      onMouseDown={handleBackdropClick}
    >
      <div onMouseDown={(e) => e.stopPropagation()} className="relative">
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
