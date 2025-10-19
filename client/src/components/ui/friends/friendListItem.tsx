// Ścieżka: components/friends/FriendListItem.tsx

"use client";

import { FriendshipInfo } from "@/lib/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Loader2, Trash2 } from "lucide-react"; // Import Trash2
import { useState } from "react";
// Importuj obie funkcje API
import { cancelFriendRequest, removeFriend } from "@/lib/api/friends";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type FriendListItemProps = {
  friendshipInfo: FriendshipInfo;
  onActionComplete: () => void; // Callback to refresh the list
};

export function FriendListItem({
  friendshipInfo,
  onActionComplete,
}: FriendListItemProps) {
  const otherUserData = friendshipInfo.otherUser;
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false); // State for removing friend

  // Failsafe if backend didn't send otherUser data
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

  // Generate fallback initials for avatar
  const fallbackName = otherUserData.username
    ? otherUserData.username.substring(0, 2).toUpperCase()
    : "?";

  // Handler for cancelling a sent request
  const handleCancelRequest = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // Stop propagation to Link
    e.preventDefault();
    setIsCancelling(true);
    const result = await cancelFriendRequest(friendshipInfo.ID);
    if (result.success) {
      toast.success(result.message);
      onActionComplete(); // Refresh list
    } else {
      toast.error(result.message);
      setIsCancelling(false); // Only unlock on error
    }
  };

  // Handler for removing an accepted friend
  const handleRemoveFriend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Stop propagation to Link
    e.preventDefault();

    // Optional: Add confirmation dialog here
    // if (!confirm(`Are you sure you want to remove ${otherUserData.username}?`)) {
    //     return;
    // }

    setIsRemoving(true);
    const result = await removeFriend(friendshipInfo.ID); // Use the friendship ID
    if (result.success) {
      toast.success(result.message);
      onActionComplete(); // Refresh list
    } else {
      toast.error(result.message);
      setIsRemoving(false); // Only unlock on error
    }
    // Don't reset isRemoving on success as the item disappears
  };

  return (
    // Entire item is a link to the profile, handles hover style and cursor
    <Link
      href={`/profile/${otherUserData.ID}`}
      className="flex items-center justify-between p-3 border-b dark:border-zinc-700 min-h-[68px] hover:bg-muted/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
      onClick={(e) => {
        // Prevent navigation if a button inside was clicked
        if ((e.target as HTMLElement).closest("button")) {
          e.preventDefault();
        }
      }}
    >
      {/* Left side: Avatar, Name, Level/Pts */}
      <div className="flex items-center gap-3 overflow-hidden mr-2 pointer-events-none">
        {" "}
        {/* pointer-events-none prevents interfering with Link */}
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

      {/* Right side: Status / Action Button */}
      <div className="flex-shrink-0">
        {/* === Sent Request (Pending) === */}
        {friendshipInfo.status === "pending" && (
          // Container receives hover, applies 'group'
          <div className="relative h-7 w-[76px] group">
            {/* Badge shown by default, hidden on group hover */}
            <Badge
              variant="secondary"
              className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-150 pointer-events-none"
            >
              Pending
            </Badge>
            {/* Cancel Button shown on group hover */}
            <Button
              variant="destructive"
              size="sm"
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-7 px-2 text-xs"
              onClick={handleCancelRequest} // Use specific handler
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

        {/* === Accepted Friend === */}
        {friendshipInfo.status === "accepted" && (
          // Container receives hover, applies 'group'
          <div className="relative h-7 w-[80px] group">
            {/* "Friend" text shown by default, hidden on group hover */}
            <span className="absolute inset-0 flex items-center justify-center text-xs text-green-600 dark:text-green-400 font-medium px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/50 group-hover:opacity-0 transition-opacity duration-150 pointer-events-none">
              Friend
            </span>
            {/* Remove Button shown on group hover */}
            <Button
              variant="destructive"
              size="sm"
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 h-7 px-2 text-xs"
              onClick={handleRemoveFriend} // Use specific handler
              disabled={isRemoving} // Use removing state
            >
              {isRemoving ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Trash2 className="w-3 h-3 mr-1" /> // Trash icon
              )}
              Remove
            </Button>
          </div>
        )}
        {/* You can add logic for 'blocked' status here if needed */}
      </div>
    </Link> // End of the main Link component
  );
}
