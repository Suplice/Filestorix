"use client";
import useFileHandlers from "@/hooks/use-file-handlers";
import { ChevronRight } from "lucide-react";
import { FileRoute as FileRouteType } from "@/lib/types/file";
import { useState } from "react";
import useDragAndDropFiles from "@/hooks/use-drag-and-drop-files";
import { cn } from "@/lib/utils/utils";

interface FileRouteProps {
  route: FileRouteType;
  index: number;
}

const FileRoute: React.FC<FileRouteProps> = ({ route, index }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const { handleChangeRoute } = useFileHandlers();
  const { handleRouteDrop } = useDragAndDropFiles();

  return (
    <div className="flex items-center">
      {index !== 0 && <ChevronRight className="w-6 h-6 text-gray-500" />}
      <div
        className={cn(
          " cursor-pointer transition-all duration-200  hover:bg-secondary rounded-xl px-4 py-1",
          isDragOver && "bg-secondary"
        )}
        onClick={() => handleChangeRoute(route.catalogId)}
        onDragEnter={() => setIsDragOver(true)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          setIsDragOver(false);
          handleRouteDrop(route.catalogId);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
        }}
      >
        <p className="text-2xl font-extrabold">{route.sectionName}</p>
      </div>
    </div>
  );
};

export default FileRoute;
