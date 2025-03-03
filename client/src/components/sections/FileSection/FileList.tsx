"use client";
import { useFile } from "@/hooks/use-file";
import FileCard from "./FileCard";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileList = () => {
  const { files, isLoading } = useFile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden gap-4">
      <FileTableHeader />
      <div className="flex flex-col gap-2 overflow-y-auto h-full px-2 no-scrollbar">
        {files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FileList;

const FileTableHeader = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-muted/80 text-muted-foreground font-medium border-b place-items-start">
      <Button variant="ghost" className="">
        Name
        <ArrowUp size={16} />
      </Button>
      <Button variant="ghost" className="">
        Size
        <ArrowUp size={16} />
      </Button>
      <Button variant="ghost" className="">
        Type
        <ArrowUp size={16} />
      </Button>
      <Button variant="ghost" className="">
        Date
        <ArrowUp size={16} />
      </Button>
    </div>
  );
};
