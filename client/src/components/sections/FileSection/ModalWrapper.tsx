"use client";
import { useModal } from "@/hooks/use-modal";
import { motion } from "framer-motion";

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
    <motion.div
      className="w-full h-full flex items-center justify-center pointer-events-auto "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-50"
        data-testid="testBackground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onMouseDown={handleBackdropClick}
      ></motion.div>

      <motion.div
        onMouseDown={(e) => e.stopPropagation()}
        className="relative"
        initial={{ y: "20%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "20%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ModalWrapper;
