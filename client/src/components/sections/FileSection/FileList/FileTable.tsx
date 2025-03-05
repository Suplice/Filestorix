"use client";
import { useFile } from "@/hooks/use-file";
import FileCard from "./FileCard";

interface FileTableProps {
  section: "Recent" | "Favorite" | "Trash" | "Main";
}

const FileTable: React.FC<FileTableProps> = ({ section }) => {
  const { files, isLoading, favoriteFiles, trashedFiles, recentFiles } =
    useFile();

  let filesToMap = files;
  switch (section) {
    case "Recent":
      filesToMap = recentFiles;
      break;
    case "Favorite":
      filesToMap = favoriteFiles;
      break;
    case "Trash":
      filesToMap = trashedFiles;
      break;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!filesToMap || filesToMap.length === 0) {
    return <div>No files found</div>;
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full px-2 no-scrollbar">
      {filesToMap.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FileTable;
