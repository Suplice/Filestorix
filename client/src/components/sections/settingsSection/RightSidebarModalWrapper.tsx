"use client";

import { motion } from "framer-motion";
import { useModal } from "@/hooks/use-modal";

interface RightSidebarModalWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const RightSidebarModalWrapper: React.FC<RightSidebarModalWrapperProps> = ({
  children,
}) => {
  const { hideModal } = useModal();

  const handleClose = () => {
    hideModal();
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          onClick={handleClose}
        ></motion.div>

        <motion.div
          className="relative w-[400px] h-full bg-white dark:bg-neutral-900 shadow-xl"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.6 }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </>
  );
};

export default RightSidebarModalWrapper;
