"use client";
import { Progress } from "@/components/ui/progress";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import TooltipBox from "@/components/ui/tooltipBox";
import { useFile } from "@/hooks/use-file";
import { ScreenSize } from "@/lib/types/common";
import { formatFileSize, Section } from "@/lib/utils/utils";
import { setParentId, setRoute } from "@/store/locationSlice";
import { HardDrive, Home, Inbox, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const mainGroup = [
  { title: "Home", url: "/drive", icon: Home, section: Section.Main },
  {
    title: "My Drive",
    url: "/drive/my-drive",
    icon: Inbox,
    section: Section.MyDrive,
  },
];

const secondGroup = [
  {
    title: "Favorite",
    url: "/drive/favorite",
    icon: Star,
    section: Section.Favorite,
  },
  {
    title: "Recent",
    url: "/drive/recent",
    icon: Search,
    section: Section.Recent,
  },
];

const thirdGroup = [
  { title: "Trash", url: "/drive/trash", icon: Trash2, section: Section.Trash },
  {
    title: "Storage",
    url: "/drive/storage",
    icon: HardDrive,
    section: Section.Main,
  },
];

const AppSidebarBody = () => {
  const pathname = usePathname();

  const [pendingSection, setPendingSection] = useState<Section | null>(null);

  const { allFiles } = useFile();

  const dispatch = useDispatch();

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

  const handleLinkChange = (section: Section) => {
    setPendingSection(section);
  };

  useEffect(() => {
    if (pendingSection) {
      console.log(pendingSection);
      dispatch(
        setRoute({ route: [{ sectionName: pendingSection, catalogId: null }] })
      );
      dispatch(setParentId({ parentId: null }));
      setPendingSection(null);
    }
  }, [pathname]);

  return (
    <>
      {[mainGroup, secondGroup, thirdGroup].map((group, idx) => (
        <SidebarGroup key={idx}>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <TooltipBox message={item.title} visibleUntil={ScreenSize.SM}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        onClick={() => handleLinkChange(item.section)}
                        className="items-center justify-center flex sm:justify-normal p-0 gap-0 select-none overflow-auto "
                      >
                        <item.icon
                          className={`${
                            pathname === item.url && "text-blue-500"
                          }`}
                        />

                        <span
                          className={`hidden sm:block overflow-hidden text-ellipsis whitespace-nowrap  lg:text-lg md:text-base sm:text-sm ${
                            pathname === item.url
                              ? "font-semibold text-blue-500"
                              : "font-normal text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipBox>
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
