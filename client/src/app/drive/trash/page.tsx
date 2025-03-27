"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";

const Trash = () => {
  const { trashedFiles, isLoading } = useFile();
  return (
    <FileTable
      files={trashedFiles}
      isLoading={isLoading}
      section={"Trash"}
      allowCatalogs={false}
    />
  );
};

export default Trash;
