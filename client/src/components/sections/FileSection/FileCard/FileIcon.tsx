import {
  FileText,
  FileImage,
  File,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Folder,
} from "lucide-react";
import { FileIconMap } from "@/lib/types/file";
import { cn } from "@/lib/utils/utils";

const fileIcons: FileIconMap = {
  ".xlsx": { icon: FileSpreadsheet, color: "text-green-500" },
  ".csv": { icon: FileSpreadsheet, color: "text-green-500" },
  ".pdf": { icon: File, color: "text-red-500" },
  ".png": { icon: FileImage, color: "text-blue-500" },
  ".jpg": { icon: FileImage, color: "text-blue-500" },
  ".jpeg": { icon: FileImage, color: "text-blue-500" },
  ".txt": { icon: FileText, color: "text-gray-500" },
  ".zip": { icon: FileArchive, color: "text-yellow-500" },
  ".rar": { icon: FileArchive, color: "text-yellow-500" },
  ".json": { icon: FileCode, color: "text-purple-500" },
  ".xml": { icon: FileCode, color: "text-purple-500" },
  "": { icon: Folder, color: "text-yellow-500" },
};

interface FileIconProps {
  extension: string;
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ extension, className }) => {
  const { icon: Icon, color } = fileIcons[extension] || {
    icon: File,
    color: "text-muted-foreground",
  };
  return <Icon className={cn(`h-5 w-5 ${color}`, className)} />;
};

export default FileIcon;
