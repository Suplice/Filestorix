"use client";

import { FriendshipInfo } from "@/lib/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { cancelFriendRequest, removeFriend } from "@/lib/api/friends";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type FriendListItemProps = {
  friendshipInfo: FriendshipInfo;
  onActionComplete: () => void;
};

export function FriendListItem({
  friendshipInfo,
  onActionComplete,
}: FriendListItemProps) {
  const otherUserData = friendshipInfo.otherUser;
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  if (!otherUserData) {
    console.error(
      "FriendListItem: Missing otherUser data for ID:",
      friendshipInfo.ID
    );
    return (
      <div className="text-red-500 p-3 border-b dark:border-zinc-700">
        Error: User data missing
      </div>
    );
  }

  const fallbackName = otherUserData.username
    ? otherUserData.username.substring(0, 2).toUpperCase()
    : "?";

  const handleCancelRequest = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsCancelling(true);
    const result = await cancelFriendRequest(friendshipInfo.ID);
    if (result.success) {
      toast.success(result.message);
      onActionComplete();
    } else {
      toast.error(result.message);
      setIsCancelling(false);
    }
  };

  const handleRemoveFriend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setIsRemoving(true);
    const result = await removeFriend(friendshipInfo.ID);
    if (result.success) {
      toast.success(result.message);
      onActionComplete();
    } else {
      toast.error(result.message);
      setIsRemoving(false);
    }
  };

  return (
    <Link
      href={`/profile/${otherUserData.ID}`}
      className="flex items-center justify-between p-3 border-b dark:border-zinc-700 min-h-[68px] hover:bg-muted/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          e.preventDefault();
        }
      }}
    >
      <div className="flex items-center gap-3 overflow-hidden mr-2 pointer-events-none">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage
            src={otherUserData.avatarURL}
            alt={otherUserData.username}
          />
          <AvatarFallback className="bg-muted">{fallbackName}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span
            className="font-semibold text-sm truncate"
            title={otherUserData.username}
          >
            {otherUserData.username}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            Lv. {otherUserData.level} / {otherUserData.points} pts
          </span>
        </div>
      </div>

      <div className="flex-shrink-0">
        {friendshipInfo.status === "pending" && (
          <div className="relative h-7 w-[76px] group">
            <Badge
              variant="secondary"
              className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-150 pointer-events-none"
            >
              Pending
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-7 px-2 text-xs"
              onClick={handleCancelRequest}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <X className="w-3 h-3 mr-1" />
              )}
              Cancel
            </Button>
          </div>
        )}

        {friendshipInfo.status === "accepted" && (
          <div className="relative h-7 w-[80px] group">
            <span className="absolute inset-0 flex items-center justify-center text-xs text-green-600 dark:text-green-400 font-medium px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/50 group-hover:opacity-0 transition-opacity duration-150 pointer-events-none">
              Friend
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-7 px-2 text-xs"
              onClick={handleRemoveFriend}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Trash2 className="w-3 h-3 mr-1" />
              )}
              Remove
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
}
