"use client";

import useFileActions from "@/hooks/use-file-actions";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  parentId: number | null;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  isVisible,
  setIsVisible,
  parentId,
}) => {
  const { uploadFiles } = useFileActions();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsVisible(false);
      uploadFiles({
        files: acceptedFiles,
        parentId: parentId,
      });
    },
    [parentId, setIsVisible, uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    onError: () => {
      setIsVisible(false);
    },
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/plain": [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
  });

  useEffect(() => {
    setIsVisible(isDragActive);
  }, [isDragActive, setIsVisible]);

  if (!isVisible) return null;

  return (
    <div
      {...getRootProps()}
      className={`sticky inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50  ${
        isDragActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-white font-bold text-lg">Drop files here</p>
    </div>
  );
};

export default FileDropzone;
