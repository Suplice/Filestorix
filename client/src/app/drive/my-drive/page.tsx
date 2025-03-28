"use client";
import FileTable from "@/components/sections/FileSection/FileList/FileTable";
import { useFile } from "@/hooks/use-file";
import { Section } from "@/lib/utils/utils";

const Home = () => {
  const { files, isLoading } = useFile();

  return (
    <FileTable
      files={files}
      isLoading={isLoading}
      section={Section.MyDrive}
      allowCatalogs={true}
    />
  );
};

export default Home;
