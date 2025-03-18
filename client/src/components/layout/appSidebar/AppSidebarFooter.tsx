"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/hooks/use-modal";
import { User2, ChevronUp, Settings, LogOut } from "lucide-react";

const AppSidebarFooter = () => {
  const { user, handleLogout } = useAuth();
  const { showModal } = useModal();

  return (
    <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User2 className="h-5 w-5" />
                <span className="truncate">{user?.username}</span>
                <ChevronUp className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-full">
              <DropdownMenuItem
                onClick={() => {
                  console.log("test");
                  showModal("Settings", {});
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
