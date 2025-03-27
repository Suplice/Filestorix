"use client";
import { UserFile } from "@/lib/types/file";
import { useMemo } from "react";

interface FileSizeCellProps {
  file: UserFile;
}

const FileSizeCell: React.FC<FileSizeCellProps> = ({ file }) => {
  const formatSize = useMemo(() => {
    if (file.size < 1024) return `${file.size} B`;
    if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(2)} KB`;
    if (file.size < 1024 * 1024 * 1024)
      return `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }, [file.size]);

  return <p>{file.type === "CATALOG" ? "-" : formatSize}</p>;
};

export default FileSizeCell;
