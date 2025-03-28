"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";
import { Section } from "@/lib/utils/utils";

const Recent = () => {
  const { recentFiles, isLoading } = useFile();
  return (
    <FileTable
      files={recentFiles}
      isLoading={isLoading}
      section={Section.Recent}
      allowCatalogs={false}
    />
  );
};

export default Recent;
