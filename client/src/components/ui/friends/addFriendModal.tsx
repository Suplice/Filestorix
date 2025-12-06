"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Loader2, Search } from "lucide-react";
import { searchUsers, sendFriendRequest } from "@/lib/api/friends";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { UserDTO } from "@/lib/types/user";

type AddFriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<Record<number, boolean>>(
    {}
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setIsTyping(false);

    if (!debouncedSearchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      const results = await searchUsers(debouncedSearchQuery);
      setSearchResults(results || []);
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const handleAddFriend = async (friendId: number) => {
    setSendingRequest((prev) => ({ ...prev, [friendId]: true }));
    const result = await sendFriendRequest(friendId);
    if (result.success) {
      toast.success(result.message);
      setSearchResults((prev) => prev.filter((user) => user.ID !== friendId));
    } else {
      toast.error(result.message);
      setSendingRequest((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsTyping(false);
    setIsSearching(false);
    setSendingRequest({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsTyping(!!value);
    if (!value) {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md min-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Add New Friend
          </DialogTitle>
          <DialogDescription>
            Search for users by their username and send a friend request.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Enter username..."
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-8"
            aria-label="Search username"
          />
          {(isTyping || isSearching) && (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
        <div className="mt-4 h-60 overflow-y-auto space-y-2 pr-2 border rounded-md p-2 dark:border-zinc-700">
          {isSearching && (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {!isSearching &&
            searchResults.length === 0 &&
            debouncedSearchQuery && (
              <p className="text-center text-sm text-muted-foreground pt-10">
                No users found matching &quot;{debouncedSearchQuery}&quot;.
              </p>
            )}
          {!isSearching &&
            searchResults.length === 0 &&
            !debouncedSearchQuery &&
            searchQuery && (
              <p className="text-center text-sm text-muted-foreground pt-10">
                Keep typing to search...
              </p>
            )}
          {!isSearching && searchResults.length === 0 && !searchQuery && (
            <p className="text-center text-sm text-muted-foreground pt-10">
              Enter a username to search for friends.
            </p>
          )}

          {!isSearching &&
            searchResults.map((user) => (
              <div
                key={user.ID}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 overflow-hidden mr-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={user.avatarURL} alt={user.username} />
                    <AvatarFallback className="text-xs">
                      {user.username?.substring(0, 2).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className="text-sm font-medium truncate"
                    title={user.username}
                  >
                    {user.username}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddFriend(user.ID)}
                  disabled={sendingRequest[user.ID]}
                  className="text-xs h-7 px-2 flex-shrink-0"
                >
                  {sendingRequest[user.ID] ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <UserPlus className="w-3 h-3 mr-1" />
                  )}
                  Add
                </Button>
              </div>
            ))}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
