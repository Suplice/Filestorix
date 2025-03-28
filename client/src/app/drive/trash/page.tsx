"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";
import { Section } from "@/lib/utils/utils";

const Trash = () => {
  const { trashedFiles, isLoading } = useFile();
  return (
    <FileTable
      files={trashedFiles}
      isLoading={isLoading}
      section={Section.Trash}
      allowCatalogs={false}
    />
  );
};

export default Trash;
