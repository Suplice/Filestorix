"use client";

import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropzoneProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsVisible(false);
    console.log("Dropped files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    setIsVisible(isDragActive);
  }, [isDragActive]);

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
