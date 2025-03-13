"use client";

import { useModal } from "@/hooks/use-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FolderPlus, FilePlus } from "lucide-react";
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
          <FilePlus className="w-4 h-4 text-muted-foreground" />
          <span>Add File</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => showModal("CatalogUploader", { parentId })}
          className="flex items-center gap-2 px-2 py-2 cursor-pointer"
        >
          <FolderPlus className="w-4 h-4 text-muted-foreground" />
          <span>Add Folder</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateButton;
