"use client";
import AppSidebar from "@/components/layout/appSidebar/appSidebar";
import SearchCommand from "@/components/layout/searchCommand/searchCommand";
import ErrorLoadFilesFallback from "@/components/sections/FileSection/ErrorLoadFilesFallback";
import AddFile from "@/components/sections/FileSection/FileAdder";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
      <div className="flex flex-col w-full p-4 gap-4 bg-sidebar h-screen">
        <SearchCommand />
        <main className="w-full h-[calc(100%-60px)] rounded-2xl bg-card p-6">
          <QueryErrorResetBoundary>
            <ErrorBoundary
              fallbackRender={({ resetErrorBoundary }) => (
                <ErrorLoadFilesFallback reset={resetErrorBoundary} />
              )}
            >
              {children}
            </ErrorBoundary>
          </QueryErrorResetBoundary>
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
