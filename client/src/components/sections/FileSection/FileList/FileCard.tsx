import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Folder } from "lucide-react";
import { UserFile } from "@/lib/types/file";

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const FileCard = ({ file }: { file: UserFile }) => {
  return (
    <Card className="grid grid-cols-4 items-center gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        {file.type === "CATALOG" ? (
          <Folder className="h-5 w-5 text-yellow-500" />
        ) : (
          <FileText className="h-5 w-5 text-blue-500" />
        )}
        <span>{file.name}</span>
      </div>
      <span>{formatSize(file.size)}</span>
      <span className="capitalize">{file.type.toLowerCase()}</span>
      <div className="flex items-center justify-between">
        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Open", file.name)}>
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Rename", file.name)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Delete", file.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default FileCard;
