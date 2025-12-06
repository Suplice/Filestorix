"use client";

import SearchCommand from "../SearchCommand/searchCommand";
import ThemeModeToggle from "@/components/sections/ThemeSection/ThemeModeToggle";
import { useAuth } from "@/context/AuthContext";
import { Flame, Star, Coins, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getXpForNextLevel } from "@/lib/utils/xpUtils";

const AppTopbar = () => {
  const { user } = useAuth();

  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "??";

  const xpProgress = user ? getXpForNextLevel(user.level, user.xp) : null;
  let tooltipContent = xpProgress
    ? `${xpProgress.xpInCurrentLevel} / ${
        xpProgress.xpForNextLevel - xpProgress.xpForCurrentLevel
      } XP to Level ${xpProgress.nextLevel || user?.level}`
    : "XP Progress";
  if (xpProgress && xpProgress.nextLevel === null) {
    tooltipContent = `${user?.xp} XP (Max Level Reached)`;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-row w-full items-center justify-between ">
        <SearchCommand />

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{user.streakCount} day streak</span>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground cursor-default">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>Lv. {user.level}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipContent}</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Coins className="h-4 w-4 text-amber-500" />
                <span>{user.points}</span>
              </div>
            </>
          )}

          <ThemeModeToggle />

          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatarURL || ""}
              alt={user?.username || "User avatar"}
            />
            <AvatarFallback className="text-xs">
              {user?.username ? userInitials : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AppTopbar;
