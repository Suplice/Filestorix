"use client";

import useFileActions from "@/hooks/use-file-actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

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

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      setIsVisible(false);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const onDrop = (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    e: DropEvent
  ) => {
    setIsVisible(false);
    uploadFiles({
      files: acceptedFiles,
      parentId: parentId,
    });
    console.log(e);
  };

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
    setIsVisible(isVisible);
  }, [isDragActive]);

  if (!isVisible) return null;

  return (
    <div
      {...getRootProps()}
      className={`sticky inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50  ${
        isDragActive ? "opacity-100" : "opacity-50"
      }`}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsVisible(false);
      }}
    >
      <input {...getInputProps()} />
      <p className="text-white font-bold text-lg">Drop files here</p>
    </div>
  );
};

export default FileDropzone;
