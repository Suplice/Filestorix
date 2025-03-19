"use client";

import { useModal } from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FolderPlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateButtonProps {
  parentId: number | null;
}

const CreateButton: React.FC<CreateButtonProps> = ({ parentId }) => {
  const { showModal } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 p-0  hover:bg-muted rounded-md"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-md  bg-popover p-1 shadow-lg"
      >
        <DropdownMenuItem
          onClick={() => showModal("FileUploader", { parentId })}
          className="flex items-center gap-2 px-2 py-2 cursor-pointer"
        >
          <Upload />
          <p>Upload Files</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => showModal("CatalogUploader", { parentId })}
          className="flex items-center gap-2 px-2 py-2 cursor-pointer"
        >
          <FolderPlus />
          <p>Create Folder</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateButton;
