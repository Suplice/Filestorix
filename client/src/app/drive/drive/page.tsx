"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";

const MyDrive = () => {
  const { files, isLoading } = useFile();

  return (
    <FileTable
      files={files}
      isLoading={isLoading}
      section={"Home"}
      allowCatalogs={true}
    />
  );
};

export default MyDrive;
