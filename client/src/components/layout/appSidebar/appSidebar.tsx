import { Sidebar, SidebarContent } from "../../ui/sidebar";
import AppSidebarBody from "./AppSidebarBody";
import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";

const AppSidebar = () => {
  return (
    <Sidebar
      collapsible="none"
      className={`w-[20%] xl:w-[10%] md:w-[15%] min-h-screen p-2 `}
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
