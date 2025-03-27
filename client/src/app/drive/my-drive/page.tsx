"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";

const Home = () => {
  const { files, isLoading } = useFile();

  return (
    <FileTable
      files={files}
      isLoading={isLoading}
      section={"MyDrive"}
      allowCatalogs={true}
    />
  );
};

export default Home;
