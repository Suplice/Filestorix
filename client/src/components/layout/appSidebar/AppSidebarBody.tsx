"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import TooltipBox from "@/components/ui/tooltipBox";
import { useAuth } from "@/context/AuthContext";
import { ScreenSize } from "@/lib/types/common";
import { Section } from "@/lib/utils/utils";
import { Book, Home, Trophy, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainGroup = [
  { title: "Home", url: "/home", icon: Home, section: Section.Home },
  {
    title: "Courses",
    url: "/courses",
    icon: Book,
    section: Section.Courses,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Trophy,
    section: Section.Leaderboard,
  },
];

const secondGroup = [
  {
    title: "Friends",
    url: "/friends",
    icon: Users,
    section: Section.Friends,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    section: Section.Profile,
  },
];

const AppSidebarBody = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {[mainGroup, secondGroup].map((group, idx) => (
        <SidebarGroup key={idx}>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <TooltipBox message={item.title} visibleUntil={ScreenSize.SM}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={
                          item.url === "/profile"
                            ? `${item.url}/${user?.ID}`
                            : item.url
                        }
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};

export default AppSidebarBody;
