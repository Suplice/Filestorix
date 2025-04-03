import { Sidebar, SidebarContent } from "../../ui/sidebar";
import AppSidebarBody from "./AppSidebarBody";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import useSidebarWidth from "@/hooks/use-sidebar-width";
import AppSidebarResizer from "./AppSidebarResizer";

const AppSidebar = () => {
  const { tempWidth, handleMouseDown } = useSidebarWidth();

  return (
    <Sidebar
      collapsible="none"
      style={{
        width: `calc(20% + ${tempWidth}px)`,
      }}
      className="min-h-screen p-2 relative md:w-auto xl:w-auto"
    >
      <SidebarContent>
        <AppSidebarHeader />
        <AppSidebarBody />
      </SidebarContent>
      <AppSidebarFooter />

      <AppSidebarResizer onMouseDown={handleMouseDown} />
    </Sidebar>
  );
};

export default AppSidebar;
