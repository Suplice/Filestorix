import AppSidebar from "@/components/layout/appSidebar/appSidebar";
import SearchCommand from "@/components/layout/searchCommand/searchCommand";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DriveLayoutProps {
  children: React.ReactNode;
}

const DriveLayout: React.FC<DriveLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full p-4 gap-4 bg-sidebar">
        <SearchCommand />
        <main className="w-full h-full rounded-2xl bg-card p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DriveLayout;
