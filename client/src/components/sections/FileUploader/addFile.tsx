"use client";
import { createPortal } from "react-dom";
import FileUploader from "./FileUploader";

interface AddFileProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AddFile: React.FC<AddFileProps> = ({ isOpen, handleClose }) => {
  if (!isOpen) {
    return;
  }

  return createPortal(
    <div
      className="w-full h-full flex items-center justify-center pointer-events-auto backdrop-brightness-[0.3]"
      onClick={handleClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <FileUploader />
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default AddFile;
