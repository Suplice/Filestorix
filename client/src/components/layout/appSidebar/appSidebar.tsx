import { Sidebar, SidebarContent } from "../../ui/sidebar";
import AppSidebarBody from "./AppSidebarBody";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";

const AppSidebar = () => {
  return (
    <Sidebar
      collapsible="none"
      className="xl:w-64 lg:w-48 md:w-36 w-32 min-h-screen p-2"
    >
      <SidebarContent>
        <AppSidebarHeader />
        <AppSidebarBody />
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
