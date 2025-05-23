"use client";
import { Button } from "@/components/ui/button";
import TooltipBox from "@/components/ui/tooltipBox";
import { useModal } from "@/hooks/use-modal";
import { Moon, Sun } from "lucide-react";

const ThemeModeToggle = () => {
  const { showModal } = useModal();

  return (
    <TooltipBox message="Toggle Theme">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          showModal("Settings", {});
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </TooltipBox>
  );
};

export default ThemeModeToggle;
