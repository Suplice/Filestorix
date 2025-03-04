"use client";
import { useFile } from "@/hooks/use-file";
import FileCard from "./FileCard";

const FileTable = () => {
  const { files, isLoading } = useFile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!files || files.length === 0) {
    return <div>No files found</div>;
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full px-2 no-scrollbar">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FileTable;
