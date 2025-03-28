"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";
import { Section } from "@/lib/utils/utils";

const Storage = () => {
  const { files, isLoading } = useFile();
  return (
    <FileTable
      section={Section.Main}
      files={files}
      isLoading={isLoading}
      allowCatalogs={false}
    />
  );
};

export default Storage;
