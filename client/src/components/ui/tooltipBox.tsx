import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils/utils";
import useTooltip from "@/hooks/use-tooltip";
import { ScreenSize, Side } from "@/lib/types/common";

interface TooltipBoxProps {
  children: ReactNode;
  sideOffset?: number;
  message: string;
  className?: string;
  visibleUntil?: ScreenSize;
  side?: Side;
}

const TooltipBox: React.FC<TooltipBoxProps> = ({
  children,
  sideOffset = 5,
  message,
  className,
  visibleUntil = ScreenSize.ALL,
  side = Side.TOP,
}) => {
  const { screenWidth } = useTooltip();

  if (screenWidth > visibleUntil) {
    return children;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        sideOffset={sideOffset}
        hideWhenDetached={true}
        side={side}
        collisionPadding={16}
      >
        <p className={cn("select-none", className)}>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipBox;
