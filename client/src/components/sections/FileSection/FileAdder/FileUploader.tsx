"use client";
import { Button } from "@/components/ui/button";
import { useFile } from "@/hooks/use-file";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils/utils";
import { X } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FilePreview = {
  file: File;
  previewUrl: string;
};

const FileUploader = () => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const { uploadFiles } = useFile();
  const { hideModal, modalProps } = useModal();

  const handleRemoveFile = (file: File) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((prevFile) => prevFile.file.name !== file.name);
    });
  };

  const handleUploadFiles = () => {
    uploadFiles({
      files: files.map((filePreview) => filePreview.file),
      parentId: modalProps!.parentId,
    });
    setFiles([]);
    hideModal();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => {
      const newFiles = acceptedFiles
        .filter(
          (file) =>
            !prevFiles.some(
              (existingFile) => existingFile.file.name === file.name
            )
        )
        .map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        }));

      console.log(files);

      return [...prevFiles, ...newFiles];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "text/plain": [],
      "application/vnd.ms-excel": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
  });

  return (
    <>
      <div
        className={cn(
          "p-4 border rounded-md w-full h-full dark:bg-neutral-900 transition-all max-h-96 overflow-auto no-scrollbar",
          isDragActive && "p-8 border-blue-500 bg-blue-100 dark:bg-blue-900"
        )}
      >
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 p-6 text-center cursor-pointer transition-all"
        >
          <input {...getInputProps()} />
          <p className="text-gray-500">
            Drag & drop files here, or click to select files
          </p>
        </div>

        <div className="mt-4">
          {files.map(({ file, previewUrl }, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mt-2 justify-between"
            >
              {file.type.startsWith("image/") && (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}

              {file.type === "application/pdf" && (
                <iframe
                  src={previewUrl}
                  className="w-16 h-16 overflow-hidden rounded-md no-scrollbar select-none"
                ></iframe>
              )}

              {file.type === "text/plain" && (
                <div className="w-16 h-16 p-2 bg-gray-100 rounded-md text-sm overflow-hidden">
                  {file.name}
                </div>
              )}

              {!file.type.startsWith("image/") &&
                file.type !== "application/pdf" &&
                file.type !== "text/plain" && (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md">
                    📄
                  </div>
                )}

              <p className="text-sm">{file.name}</p>
              <X
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleRemoveFile(file)}
              />
            </div>
          ))}
        </div>
      </div>
      {files.length > 0 && (
        <div className="w-full flex justify-center mt-5">
          <Button onClick={handleUploadFiles}>Upload</Button>
        </div>
      )}
    </>
  );
};

export default FileUploader;
