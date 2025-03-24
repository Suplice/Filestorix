"use client";
import { UserFile } from "@/lib/types/file";
import { useModal } from "@/hooks/use-modal";
import FileIcon from "../FileList/FileIcon";

interface FileCardProps {
  file: UserFile;
  previewUrl?: string | null;
}

const FileCard: React.FC<FileCardProps> = ({ file, previewUrl }) => {
  const { showModal } = useModal();

  const extension = file.extension.toLowerCase();

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
          <FileIcon extension={file.extension} className="w-10 h-10" />
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
