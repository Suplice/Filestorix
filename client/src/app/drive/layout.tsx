"use client";
import AppSidebar from "@/components/layout/appSidebar/appSidebar";
import SearchCommand from "@/components/layout/searchCommand/searchCommand";
import AddFile from "@/components/sections/FileUploader/addFile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

interface DriveLayoutProps {
  children: React.ReactNode;
}

const DriveLayout: React.FC<DriveLayoutProps> = ({ children }) => {
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar
        handleOpenAddFile={() => {
          setIsAddFileOpen(true);
        }}
      />
      <div className="flex flex-col w-full p-4 gap-4 bg-sidebar">
        <SearchCommand />
        <main className="w-full h-full rounded-2xl bg-card p-6">
          {children}
        </main>
      </div>
      <AddFile
        isOpen={isAddFileOpen}
        handleClose={() => setIsAddFileOpen(false)}
      />
    </SidebarProvider>
  );
};

export default DriveLayout;
