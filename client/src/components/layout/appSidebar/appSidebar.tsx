"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Inbox,
  Star,
  Search,
  Trash2,
  HardDrive,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

const mainGroup = [
  { title: "Main Page", url: "/drive", icon: Home },
  { title: "My Drive", url: "/drive/mydrive", icon: Inbox },
];

const secondGroup = [
  { title: "Favorite", url: "/drive/favorite", icon: Star },
  { title: "Recent", url: "/drive/recent", icon: Search },
];

const thirdGroup = [
  { title: "Trash", url: "/drive/trash", icon: Trash2 },
  { title: "Storage", url: "/drive/storage", icon: HardDrive },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { showModal } = useModal();

  return (
    <Sidebar
      collapsible="none"
      className="xl:w-64 lg:w-48 md:w-36 w-32 min-h-screen p-2"
    >
      <SidebarContent>
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
                Add File
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  showModal("CatalogUploader", { parentId: null });
                }}
              >
                Add Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroup>
        {[mainGroup, secondGroup, thirdGroup].map((group, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.map((item) => (
                  <SidebarMenuItem key={item.title} title={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span
                          className={
                            pathname === item.url
                              ? "font-bold text-blue-500 xl:text-xl md:text-md sm:text-sm"
                              : " xl:text-xl md:text-md sm:text-sm"
                          }
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
