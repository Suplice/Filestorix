"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useModal } from "@/hooks/use-modal";

import { FolderPlus, Plus, Upload } from "lucide-react";
import Link from "next/link";

const AppSidebarHeader = () => {
  const { showModal } = useModal();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-center font-bold ">
          <Link href="/drive" className="lg:text-2xl text-xl">
            Filestorix
          </Link>
        </SidebarGroupLabel>
      </SidebarGroup>
      <SidebarGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="primary"
              className="w-full flex items-center gap-2"
            >
              <Plus size={64} />
              <p className="text-xl font-semibold">New</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                showModal("FileUploader", { parentId: null });
              }}
            >
              <Upload />
              <p>Upload Files</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                showModal("CatalogUploader", { parentId: null });
              }}
            >
              <FolderPlus />
              <p>Create Folder</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarGroup>
    </>
  );
};

export default AppSidebarHeader;
