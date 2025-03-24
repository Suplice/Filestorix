"use client";
import { Progress } from "@/components/ui/progress";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useFile } from "@/hooks/use-file";
import { formatFileSize } from "@/lib/utils/utils";
import { HardDrive, Home, Inbox, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const mainGroup = [
  { title: "Main Page", url: "/drive", icon: Home },
  { title: "My Drive", url: "/drive/drive", icon: Inbox },
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

  const { allFiles } = useFile();

  const { usedStorage, totalStorage, usagePercentage } = useMemo(() => {
    const usedStorage = allFiles.reduce(
      (sum, current) => sum + current.size,
      0
    );
    const totalStorage = 0.05 * 1024 * 1024 * 1024;
    const usagePercentage = (usedStorage / totalStorage) * 100;

    const specifiedUsedStorage = formatFileSize(usedStorage);
    const specifiedTotalStorage = formatFileSize(totalStorage);

    return {
      usedStorage: specifiedUsedStorage,
      totalStorage: specifiedTotalStorage,
      usagePercentage: usagePercentage,
    };
  }, [allFiles]);

  return (
    <>
      {[mainGroup, secondGroup, thirdGroup].map((group, idx) => (
        <SidebarGroup key={idx}>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.map((item) => (
                <SidebarMenuItem key={item.title} title={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="items-center justify-center flex sm:justify-normal p-0 gap-0 select-none overflow-auto"
                    >
                      <item.icon
                        className={`${
                          pathname === item.url && "text-blue-500"
                        }`}
                      />
                      <span
                        className={
                          pathname === item.url
                            ? "font-bold text-blue-500 xl:text-xl md:text-base sm:text-sm ml-2 hidden sm:flex truncate "
                            : "xl:text-xl md:text-md sm:text-base ml-2 hidden sm:flex "
                        }
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {group.some((item) => item.title === "Storage") && (
                <div className="px-2 py-1 select-none hidden sm:flex flex-col ">
                  <Progress
                    value={usagePercentage}
                    className="h-2 rounded-full"
                    color={
                      usagePercentage > 80
                        ? "bg-red-500"
                        : usagePercentage > 50
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }
                  />
                  <p className="text-sm  mt-1 flex flex-row flex-wrap gap-1">
                    <span className="font-medium lg:text-lg md:text-base sm:text-sm  ">
                      {usedStorage}
                    </span>
                    <span className="lg:text-lg md:text-base sm:text-sm  font-semibold ">
                      of
                    </span>
                    <span className="font-medium lg:text-lg md:text-base sm:text-sm ">
                      {totalStorage}
                    </span>
                  </p>
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default AppSidebarBody;
