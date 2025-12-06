"use client";
import { FriendshipInfo } from "@/lib/types/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../skeleton";
import { Users } from "lucide-react";
import { IncomingRequestItem } from "../friends/incomingRequestItem";
import { Button } from "../button";
import Link from "next/link";

type FriendRequestsWidgetProps = {
  requests: FriendshipInfo[];
  isLoading: boolean;
  onActionComplete: () => void;
};

export function FriendRequestsWidget({
  requests,
  isLoading,
  onActionComplete,
}: FriendRequestsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" /> Friend Requests
        </CardTitle>
        <CardDescription>Respond to incoming friend requests.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {" "}
        {isLoading && (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        )}
        {!isLoading && requests.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No new requests.
          </p>
        )}
        {!isLoading &&
          requests.map((req) => (
            <IncomingRequestItem
              key={req.ID}
              requestInfo={req}
              onActionComplete={onActionComplete}
            />
          ))}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/friends">View All</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
