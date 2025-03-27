"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";

const Recent = () => {
  const { recentFiles, isLoading } = useFile();
  return (
    <FileTable
      files={recentFiles}
      isLoading={isLoading}
      section={"Recent"}
      allowCatalogs={false}
    />
  );
};

export default Recent;
