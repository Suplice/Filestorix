"use client";
import AppSidebar from "@/components/layout/AppSidebar/AppSidebar";
import AppTopbar from "@/components/layout/AppTopbar/AppTopbar";
import ErrorLoadFilesFallback from "@/components/sections/FileSection/ErrorLoadFilesFallback";
import ScrollBackUp from "@/components/sections/FileSection/ScrollBackUp";
import { SidebarProvider } from "@/components/ui/sidebar";
import useScrollPosition from "@/hooks/use-scroll-position";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

interface DriveLayoutProps {
  children: React.ReactNode;
}

const DriveLayout: React.FC<DriveLayoutProps> = ({ children }) => {
  const { containerRef, isScrolled, scrollBackUp } = useScrollPosition(100);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-[80%] xl:w-[90%] md:w-[85%] flex flex-col   p-4 gap-4 bg-sidebar h-screen relative items-center">
        <AppTopbar />

        <main
          className="w-full h-full rounded-2xl bg-card overflow-y-auto no-scrollbar  "
          ref={containerRef}
        >
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
        {isScrolled && <ScrollBackUp onClick={scrollBackUp} />}
      </div>
    </SidebarProvider>
  );
};

export default DriveLayout;
