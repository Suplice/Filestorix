"use client";
import { useFile } from "@/hooks/use-file";

const Drive = () => {
  const { files, isLoading } = useFile();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (files.length === 0) {
    return <div> No files yet, maybe you can add more </div>;
  }

  return (
    <div>
      {files.map((file) => (
        <div key={file.id}>{file.name}</div>
      ))}
    </div>
  );
};

export default Drive;
