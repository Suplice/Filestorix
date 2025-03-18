"use client";
import ErrorLoadFilesFallback from "@/components/sections/FileSection/ErrorLoadFilesFallback";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

const AppSidebar = dynamic(
  () => import("@/components/layout/AppSidebar/AppSidebar"),
  { ssr: false }
);
const AppTopbar = dynamic(
  () => import("@/components/layout/AppTopbar/AppTopbar"),
  { ssr: false }
);

interface DriveLayoutProps {
  children: React.ReactNode;
}

const DriveLayout: React.FC<DriveLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full p-4 gap-4 bg-sidebar h-screen">
        <AppTopbar />
        <main className="w-full h-full rounded-2xl bg-card p-6 overflow-y-auto no-scrollbar">
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
