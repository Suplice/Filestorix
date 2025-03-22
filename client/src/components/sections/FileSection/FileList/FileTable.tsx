"use client";
import { useState } from "react";
import { UserFile, FileRoute } from "@/lib/types/file";
import dynamic from "next/dynamic";
import FileTableBody from "./FileTableBody";
import FileDropzone from "./FileDropzone";

const FileRouteManager = dynamic(
  () => import("@/components/sections/FileSection/FileList/FileRouteManager"),
  { ssr: false }
);
const CreateButton = dynamic(
  () => import("@/components/sections/FileSection/FileList/CreateButton"),
  { ssr: false }
);
const FileMainGallery = dynamic(
  () =>
    import("@/components/sections/FileSection/FileMainGallery/FileMainGallery"),
  { ssr: false }
);

interface FileTableProps {
  files: UserFile[];
  isLoading: boolean;
  section: string;
  allowCatalogs: boolean;
}

const FileTable: React.FC<FileTableProps> = ({
  files,
  isLoading,
  section,
  allowCatalogs,
}) => {
  const [parentId, setParentId] = useState<number | null>(null);
  const [route, setRoute] = useState<FileRoute[]>([
    {
      sectionName: section,
      catalogId: null,
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFolderClick = (fileId: number, fileName: string) => {
    if (!allowCatalogs) return;

    const file = files.find((file) => file.id === fileId);
    if (file?.type === "CATALOG") {
      setParentId(fileId);
      setRoute([...route, { sectionName: fileName, catalogId: fileId }]);
    }
  };

  const handleChangeRoute = (catalogId: number | null) => {
    setParentId(catalogId);
    const newRouteIndex = route.findIndex(
      (route) => route.catalogId === catalogId
    );
    setRoute(route.slice(0, newRouteIndex + 1));
  };

  const visibleFiles = files.filter((file) => {
    if (!allowCatalogs && file.type === "CATALOG") return false;

    if (allowCatalogs) return file.parentId === parentId;

    return true;
  });

  return (
    <>
      <div
        className="p-6 w-full h-full"
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!isDragging) setIsDragging(true);
        }}
        onDrop={() => setIsDragging(false)}
      >
        <div className="w-full flex flex-row justify-between mb-4">
          <FileRouteManager
            routes={route}
            handleChangeRoute={handleChangeRoute}
          />
          {section !== "Trash" && <CreateButton parentId={parentId} />}
        </div>
        {section === "Main" && files.length > 0 && (
          <FileMainGallery
            files={files.filter((file) => file.type !== "CATALOG").slice(0, 10)}
          />
        )}
        <FileTableBody
          files={visibleFiles}
          isLoading={isLoading}
          handleFolderClick={handleFolderClick}
        />
      </div>
      {section !== "Trash" && (
        <FileDropzone
          isVisible={isDragging}
          setIsVisible={setIsDragging}
          parentId={parentId}
        />
      )}
    </>
  );
};

export default FileTable;
