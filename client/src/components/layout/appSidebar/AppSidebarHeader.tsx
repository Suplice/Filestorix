"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const AppSidebarHeader = () => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="font-bold  flex  justify-center  select-none ">
          <Link href="/home">
            <p className="lg:text-2xl md:text-lg sm:text-sm text-xs sm:flex hidden">
              CodeQuest
            </p>
            <BookOpen className=" sm:hidden w-8 h-8" />
          </Link>
        </SidebarGroupLabel>
      </SidebarGroup>
    </>
  );
};

export default AppSidebarHeader;
