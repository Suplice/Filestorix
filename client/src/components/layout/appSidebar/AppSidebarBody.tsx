"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { HardDrive, Home, Inbox, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const AppSidebarBody = () => {
  const pathname = usePathname();

  return (
    <>
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
    </>
  );
};

export default AppSidebarBody;
