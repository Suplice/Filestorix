"use client";
import FileCard from "./FileCard";
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
import FileRouteManager from "./FileRouteManager";
import CreateButton from "./CreateButton";

interface FileTableProps {
  files: UserFile[];
  isLoading: boolean;
  section: string;
}

const FileTable: React.FC<FileTableProps> = ({ files, isLoading, section }) => {
  const [parentId, setParentId] = useState<number | null>(null);
  const [route, setRoute] = useState<FileRoute[]>([
    {
      sectionName: section,
      catalogId: null,
    },
  ]);

  const handleFolderClick = (fileId: number, fileName: string) => {
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

  return (
    <>
      <div className="w-full flex flex-row justify-between mb-4">
        <FileRouteManager
          routes={route}
          handleChangeRoute={handleChangeRoute}
        />
        <CreateButton parentId={parentId} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead className="w-[20%]">Size</TableHead>
            <TableHead className="w-[20%]">Type</TableHead>
            <TableHead className="w-[20%] text-right">Actions</TableHead>
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
              files.map(
                (file) =>
                  file.parentId === parentId && (
                    <FileCard
                      file={file}
                      key={file.id}
                      handleClick={handleFolderClick}
                    />
                  )
              )
            )}
          </TableBody>
        )}
      </Table>
    </>
  );
};

export default FileTable;
