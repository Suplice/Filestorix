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
import TooltipBox from "@/components/ui/tooltipBox";
import { useModal } from "@/hooks/use-modal";
import { ScreenSize } from "@/lib/types/common";

import { BookOpen, FolderPlus, Plus, Upload } from "lucide-react";
import Link from "next/link";

const AppSidebarHeader = () => {
  const { showModal } = useModal();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="font-bold  flex  justify-center  select-none ">
          <Link href="/drive">
            <p className="lg:text-2xl md:text-lg sm:text-sm text-xs sm:flex hidden">
              Filestorix
            </p>
            <BookOpen className=" sm:hidden w-8 h-8" />
          </Link>
        </SidebarGroupLabel>
      </SidebarGroup>
      <SidebarGroup className="flex justify-end items-center">
        <DropdownMenu>
          <TooltipBox message="New" visibleUntil={ScreenSize.SM}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="primary"
                className="w-full flex items-center justify-center "
              >
                <Plus size={64} />
                <p className="xl:text-xl lg:text-lg md:text-base sm:text-sm hidden sm:flex font-semibold">
                  New
                </p>
              </Button>
            </DropdownMenuTrigger>
          </TooltipBox>
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
              <p>Create Catalog</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarGroup>
    </>
  );
};

export default AppSidebarHeader;
