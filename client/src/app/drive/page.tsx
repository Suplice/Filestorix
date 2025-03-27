"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";

const Drive = () => {
  const { files, isLoading } = useFile();

  return (
    <FileTable
      files={files}
      isLoading={isLoading}
      section={"Main"}
      allowCatalogs={true}
    />
  );
};

export default Drive;
