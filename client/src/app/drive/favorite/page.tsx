"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";
import { Section } from "@/lib/utils/utils";

const Favorite = () => {
  const { favoriteFiles, isLoading } = useFile();

  return (
    <FileTable
      files={favoriteFiles}
      isLoading={isLoading}
      section={Section.Favorite}
      allowCatalogs={false}
    />
  );
};

export default Favorite;
