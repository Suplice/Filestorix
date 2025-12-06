"use client";

import { LeaderboardEntry } from "@/lib/types/leaderboard";
import { User } from "@/lib/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal, Star, Coins, CheckSquare } from "lucide-react";
import Link from "next/link";

type LeaderboardItemProps = {
  entry: LeaderboardEntry;
  currentUser: User | null;
  criteria: "level" | "points" | "completed";
};

export function LeaderboardItem({
  entry,
  currentUser,
  criteria,
}: LeaderboardItemProps) {
  const isCurrentUser = currentUser?.ID === entry.user.ID;
  const fallbackName =
    entry.user.username?.substring(0, 2).toUpperCase() ?? "?";

  let valueDisplay: React.ReactNode;
  switch (criteria) {
    case "level":
      valueDisplay = (
        <>
          <Star className="w-4 h-4 text-yellow-400 mr-1" /> {entry.value}
        </>
      );
      break;
    case "points":
      valueDisplay = (
        <>
          <Coins className="w-4 h-4 text-amber-500 mr-1" /> {entry.value}
        </>
      );
      break;
    case "completed":
      valueDisplay = (
        <>
          <CheckSquare className="w-4 h-4 text-blue-500 mr-1" />{" "}
          {entry.completedCourses ?? entry.value}
        </>
      );
      break;
    default:
      valueDisplay = entry.value;
  }

  return (
    <Link
      href={`/profile/${entry.user.ID}`}
      className={`flex items-center justify-between p-3 rounded-md transition-colors ${
        isCurrentUser
          ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/50"
          : "border border-transparent hover:bg-muted/50 dark:hover:bg-zinc-800/50 cursor-pointer"
      }`}
      aria-label={`View profile for ${entry.user.username}`}
    >
      <div className="flex items-center gap-4 pointer-events-none">
        <div className="flex flex-col items-center w-8">
          {entry.rank <= 3 && entry.rank > 0 ? (
            <Medal
              className={`w-5 h-5 ${
                entry.rank === 1
                  ? "text-yellow-500"
                  : entry.rank === 2
                  ? "text-slate-400"
                  : "text-yellow-700"
              }`}
            />
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {entry.rank}
            </span>
          )}
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage src={entry.user.avatarURL} alt={entry.user.username} />
          <AvatarFallback className="bg-muted text-xs">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
        <span
          className="font-semibold text-sm truncate"
          title={entry.user.username}
        >
          {entry.user.username} {isCurrentUser && "(You)"}
        </span>
      </div>

      <div className="flex items-center text-sm font-medium ml-4 pointer-events-none">
        {valueDisplay}
      </div>
    </Link>
  );
}
