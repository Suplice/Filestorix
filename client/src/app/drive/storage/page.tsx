"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";

const Storage = () => {
  const { files, isLoading } = useFile();
  return (
    <FileTable
      section="Main"
      files={files}
      isLoading={isLoading}
      allowCatalogs={false}
    />
  );
};

export default Storage;
