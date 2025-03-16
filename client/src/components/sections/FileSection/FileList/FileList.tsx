"use client";
import { useFile } from "@/hooks/use-file";
import FileTable from "./FileTable";

interface FileListProps {
  section: "Recent" | "Favorite" | "Trash" | "Main" | "MyDrive";
}

const FileList: React.FC<FileListProps> = ({ section }) => {
  const { files, isLoading, favoriteFiles, trashedFiles, recentFiles } =
    useFile();

  let allowCatalogs = true;

  let filesToMap = files;
  switch (section) {
    case "Recent":
      filesToMap = recentFiles;
      allowCatalogs = false;
      break;
    case "Favorite":
      filesToMap = favoriteFiles;
      allowCatalogs = false;
      break;
    case "Trash":
      filesToMap = trashedFiles;
      allowCatalogs = false;
      break;
  }

  return (
    <FileTable
      files={filesToMap}
      isLoading={isLoading}
      section={section}
      allowCatalogs={allowCatalogs}
    />
  );
};

export default FileList;
