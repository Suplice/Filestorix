"use client";
import { useFile } from "@/hooks/use-file";
import FileTable from "./FileTable";

interface FileListProps {
  section: "Recent" | "Favorite" | "Trash" | "Main";
}

const FileList: React.FC<FileListProps> = ({ section }) => {
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

  return (
    <FileTable files={filesToMap} isLoading={isLoading} section={section} />
  );
};

export default FileList;
