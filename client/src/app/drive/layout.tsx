"use client";
import AppSidebar from "@/components/layout/appSidebar/appSidebar";
import SearchCommand from "@/components/layout/searchCommand/searchCommand";
import ErrorLoadFilesFallback from "@/components/sections/FileSection/ErrorLoadFilesFallback";
import ModalLoadingSpinner from "@/components/sections/loadingSpinner/modalLoadingSpinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useModal } from "@/hooks/use-modal";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface DriveLayoutProps {
  children: React.ReactNode;
}

const FileAdder = lazy(
  () => import("@/components/sections/FileSection/FileAdder")
);

const DriveLayout: React.FC<DriveLayoutProps> = ({ children }) => {
  const { showModal, isOpen } = useModal();

  return (
    <SidebarProvider>
      <AppSidebar
        handleOpenAddFile={() => {
          showModal();
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
      <Suspense fallback={<ModalLoadingSpinner />}>
        {isOpen && <FileAdder />}
      </Suspense>
    </SidebarProvider>
  );
};

export default DriveLayout;
