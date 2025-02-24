import AppSidebar from "@/components/layout/appSidebar/appSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface DriveLayoutProps {
  children: React.ReactNode;
}

const DriveLayout: React.FC<DriveLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default DriveLayout;
