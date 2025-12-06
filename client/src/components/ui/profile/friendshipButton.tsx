"use client";

import { useState } from "react";
import { FriendshipStatus } from "@/lib/types/profile";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, X, Loader2, Check } from "lucide-react";
import {
  sendFriendRequest,
  cancelFriendRequest,
  removeFriend,
  respondToFriendRequest,
} from "@/lib/api/friends";
import { toast } from "sonner";

type FriendshipButtonProps = {
  profileUserId: number;
  friendshipStatus: FriendshipStatus;
  onActionComplete: () => void;
};

export function FriendshipButton({
  profileUserId,
  friendshipStatus,
  onActionComplete,
}: FriendshipButtonProps) {
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAction = async (action: () => Promise<any>) => {
    setLoading(true);
    const result = await action();
    if (result.success) {
      toast.success(result.message);
      onActionComplete();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Button disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
      </Button>
    );
  }

  switch (friendshipStatus.status) {
    case "friends":
      return (
        <Button
          variant="destructive"
          onClick={() =>
            handleAction(() => removeFriend(friendshipStatus.friendshipId!))
          }
        >
          <UserMinus className="w-4 h-4 mr-2" /> Remove Friend
        </Button>
      );
    case "request_sent":
      return (
        <Button
          variant="secondary"
          onClick={() =>
            handleAction(() =>
              cancelFriendRequest(friendshipStatus.friendshipId!)
            )
          }
        >
          <X className="w-4 h-4 mr-2" /> Cancel Request
        </Button>
      );
    case "request_received":
      return (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              handleAction(() =>
                respondToFriendRequest(friendshipStatus.friendshipId!, "accept")
              )
            }
          >
            <Check className="w-4 h-4 mr-2" /> Accept
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              handleAction(() =>
                respondToFriendRequest(
                  friendshipStatus.friendshipId!,
                  "decline"
                )
              )
            }
          >
            <X className="w-4 h-4 mr-2" /> Decline
          </Button>
        </div>
      );
    case "not_friends":
    default:
      return (
        <Button
          onClick={() => handleAction(() => sendFriendRequest(profileUserId))}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add Friend
        </Button>
      );
  }
}
