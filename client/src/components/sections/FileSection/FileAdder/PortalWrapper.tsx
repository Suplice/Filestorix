"use client";
import FileUploader from "./FileUploader";
import ModalPortal from "../ModalPortal";

const FileUploaderWrapper = () => {
  return (
    <ModalPortal>
      <FileUploader />
    </ModalPortal>
  );
};

export default FileUploaderWrapper;
