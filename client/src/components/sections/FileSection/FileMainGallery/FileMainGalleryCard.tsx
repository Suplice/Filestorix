"use client";
import { UserFile } from "@/lib/types/file";
import { useModal } from "@/hooks/use-modal";
import {
  FileImageIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FileIcon,
} from "lucide-react";

interface FileCardProps {
  file: UserFile;
  previewUrl?: string | null;
}

const FileCard: React.FC<FileCardProps> = ({ file, previewUrl }) => {
  const { showModal } = useModal();

  const extension = file.extension.toLowerCase();

  const getPlaceholderIcon = () => {
    if (
      extension.startsWith(".jpg") ||
      extension.startsWith(".jpeg") ||
      extension.startsWith(".png") ||
      extension.startsWith(".gif") ||
      extension.startsWith(".webp") ||
      extension.startsWith(".svg")
    ) {
      return <FileImageIcon className="h-12 w-12 text-muted-foreground" />;
    } else if (extension === ".pdf") {
      return <FileIcon className="h-12 w-12 text-red-500" />;
    } else if (extension === ".txt") {
      return <FileTextIcon className="h-12 w-12 text-muted-foreground" />;
    } else if ([".xls", ".xlsx"].includes(extension)) {
      return <FileSpreadsheetIcon className="h-12 w-12 text-green-500" />;
    } else {
      return <FileIcon className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <div
      onClick={() =>
        showModal("FilePreview", {
          fileName: file.id + file.extension,
        })
      }
      className="group flex flex-col justify-between cursor-pointer select-none"
    >
      <div className="flex aspect-[3/2] overflow-hidden rounded-xl bg-muted/20 items-center justify-center max-h-[200px] w-full border border-gray-500 dark:border-gray-900">
        {previewUrl &&
        extension.startsWith(".") &&
        extension.match(/\.(jpg|jpeg|png|gif|webp|svg)$/) ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105 brightness-75"
            loading="lazy"
          />
        ) : (
          getPlaceholderIcon()
        )}
      </div>

      <div className="mt-4 text-lg font-medium line-clamp-2">
        {file.name + file.extension}
      </div>

      <div className="text-sm text-muted-foreground line-clamp-1">
        {(file.size / 1024).toFixed(2)} KB
      </div>
    </div>
  );
};

export default FileCard;
