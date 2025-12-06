"use client";
import { LeaderboardEntry } from "@/lib/types/leaderboard";
import { User } from "@/lib/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Skeleton } from "../skeleton";
import { LeaderboardItem } from "../leaderboard/leaderboardItem";

type LeaderboardWidgetProps = {
  topEntries: LeaderboardEntry[];
  currentUserEntry: LeaderboardEntry | undefined;
  isLoading: boolean;
  criteria: "level" | "points" | "completed";
  currentUser: User | null;
};

export function LeaderboardWidget({
  topEntries,
  currentUserEntry,
  isLoading,
  criteria,
  currentUser,
}: LeaderboardWidgetProps) {
  const displayEntries = topEntries.slice(0, 3);
  const isCurrentUserInTop =
    currentUserEntry &&
    displayEntries.some((entry) => entry.user.ID === currentUserEntry.user.ID);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Top Friends (Level){" "}
        </CardTitle>
        <CardDescription>
          See how you stack up against your friends.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading && (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        )}
        {!isLoading && displayEntries.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No friends data available.
          </p>
        )}
        {!isLoading &&
          displayEntries.map((entry) => (
            <LeaderboardItem
              key={entry.user.ID}
              entry={entry}
              currentUser={currentUser}
              criteria={criteria}
            />
          ))}
        {!isLoading && currentUserEntry && !isCurrentUserInTop && (
          <>
            <div className="text-center text-muted-foreground text-xs my-2">
              ...
            </div>
            <LeaderboardItem
              entry={currentUserEntry}
              currentUser={currentUser}
              criteria={criteria}
            />
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/leaderboard">View Full Leaderboard</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
