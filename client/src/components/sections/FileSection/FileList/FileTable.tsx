"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserFile, FileRoute } from "@/lib/types/file";
import FileTableSkeleton from "./FileTableSkeleton";
import dynamic from "next/dynamic";

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

const FileCard = dynamic(
  () => import("@/components/sections/FileSection/FileList/FileCard"),
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
      <Table className="select-none w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Name</TableHead>
            <TableHead className="w-[20%]">Modified At</TableHead>
            <TableHead className="w-[20%]">Size</TableHead>
            <TableHead className="w-[20%]">Type</TableHead>
            <TableHead className="w-[15%]"></TableHead>
            <TableHead className="w-[5%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <FileTableSkeleton />
        ) : (
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell>No files found</TableCell>
              </TableRow>
            ) : (
              visibleFiles.map((file) => (
                <FileCard
                  file={file}
                  key={file.id}
                  handleClick={handleFolderClick}
                />
              ))
            )}
          </TableBody>
        )}
      </Table>
    </>
  );
};

export default FileTable;
