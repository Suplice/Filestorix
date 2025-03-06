"use client";
import FileUploader from "./FileUploader";
import ModalPortal from "../ModalPortal";

const FileAdder = () => {
  return (
    <ModalPortal>
      <FileUploader />
    </ModalPortal>
  );
};

export default FileAdder;
