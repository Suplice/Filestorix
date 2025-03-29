"use client";
import { useMemo, useState } from "react";
import { UserFile } from "@/lib/types/file";
import dynamic from "next/dynamic";
import FileTableBody from "./FileTableBody";
import FileDropzone from "./FileDropzone";
import { Section } from "@/lib/utils/utils";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import EmptyList from "./EmptyList";

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
  section: Section;
  allowCatalogs: boolean;
}

const FileTable: React.FC<FileTableProps> = ({
  files,
  isLoading,
  section,
  allowCatalogs,
}) => {
  const parentId = useSelector((state: RootState) => state.location.parentId);

  const [isDragging, setIsDragging] = useState(false);

  const visibleFiles = useMemo(() => {
    return files.filter((file) => {
      if (!allowCatalogs && file.type === "CATALOG") return false;

      if (allowCatalogs) return file.parentId === parentId;

      return true;
    });
  }, [files, parentId, allowCatalogs]);

  const mainGalleryFiles = useMemo(() => {
    return files.filter((file) => file.type !== "CATALOG").slice(0, 10);
  }, [files]);

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
          <FileRouteManager />
          <CreateButton parentId={parentId} />
        </div>

        {section === Section.Main && files.length > 0 && (
          <FileMainGallery files={mainGalleryFiles} />
        )}

        <FileTableBody files={visibleFiles} isLoading={isLoading} />

        {visibleFiles.length === 0 && !isLoading && (
          <EmptyList section={section} />
        )}
      </div>

      <FileDropzone
        isVisible={isDragging && section !== Section.Trash}
        setIsVisible={setIsDragging}
        parentId={parentId}
      />
    </>
  );
};

export default FileTable;
