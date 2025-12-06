"use client";

import { FriendshipInfo } from "@/lib/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { respondToFriendRequest } from "@/lib/api/friends";
import { toast } from "sonner";

type IncomingRequestItemProps = {
  requestInfo: FriendshipInfo;
  onActionComplete: () => void;
};

export function IncomingRequestItem({
  requestInfo,
  onActionComplete,
}: IncomingRequestItemProps) {
  const senderData = requestInfo.otherUser;
  const [loadingAction, setLoadingAction] = useState<
    "accept" | "decline" | null
  >(null);

  if (!senderData) {
    console.error(
      "IncomingRequestItem: Missing otherUser data for request ID:",
      requestInfo.ID
    );
    return (
      <div className="text-red-500 p-3 border-b dark:border-zinc-700">
        Error: Sender data missing
      </div>
    );
  }

  const fallbackName = senderData.username
    ? senderData.username.substring(0, 2).toUpperCase()
    : "?";

  const handleResponse = async (action: "accept" | "decline") => {
    setLoadingAction(action);
    const result = await respondToFriendRequest(requestInfo.ID, action);
    if (result.success) {
      toast.success(result.message);
      onActionComplete();
    } else {
      toast.error(result.message);
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b dark:border-zinc-700 min-h-[68px]">
      <div className="flex items-center gap-3 overflow-hidden mr-2">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={senderData.avatarURL} alt={senderData.username} />
          <AvatarFallback className="bg-muted">{fallbackName}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span
            className="font-semibold text-sm truncate"
            title={senderData.username}
          >
            {senderData.username}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            wants to be your friend
          </span>
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/50 dark:hover:text-green-400"
          onClick={() => handleResponse("accept")}
          disabled={!!loadingAction}
          aria-label="Accept request"
        >
          {loadingAction === "accept" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50 dark:hover:text-red-400"
          onClick={() => handleResponse("decline")}
          disabled={!!loadingAction}
          aria-label="Decline request"
        >
          {loadingAction === "decline" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
