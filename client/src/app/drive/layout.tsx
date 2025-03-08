"use client";
import AppSidebar from "@/components/layout/AppSidebar/AppSidebar";
import AppTopbar from "@/components/layout/AppTopbar/AppTopbar";
import ErrorLoadFilesFallback from "@/components/sections/FileSection/ErrorLoadFilesFallback";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

interface DriveLayoutProps {
  children: React.ReactNode;
}

const DriveLayout: React.FC<DriveLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full p-4 gap-4 bg-sidebar h-screen">
        <AppTopbar />
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
    </SidebarProvider>
  );
};

export default DriveLayout;
