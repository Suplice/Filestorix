"use client";
import AppSidebar from "@/components/layout/AppSidebar/AppSidebar";
import AppTopbar from "@/components/layout/AppTopbar/AppTopbar";
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
      <div className="w-[80%] xl:w-[90%] md:w-[85%] flex flex-col   p-4 gap-4 bg-sidebar h-screen relative items-center">
        <AppTopbar />

        <main className="w-full h-full rounded-2xl bg-card overflow-y-auto no-scrollbar">
          <QueryErrorResetBoundary>
            <ErrorBoundary
              fallbackRender={({ resetErrorBoundary }) => (
                <div onClick={resetErrorBoundary}>error</div>
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
