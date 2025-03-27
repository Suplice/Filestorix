"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";

const Favorite = () => {
  const { favoriteFiles, isLoading } = useFile();
  return (
    <FileTable
      files={favoriteFiles}
      isLoading={isLoading}
      section={"Favorite"}
      allowCatalogs={false}
    />
  );
};

export default Favorite;
