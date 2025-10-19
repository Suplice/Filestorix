// Ścieżka: components/friends/AddFriendModal.tsx

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
// Importuj UserDTO i funkcje API
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
  const [searchResults, setSearchResults] = useState<UserDTO[]>([]); // Stan używa UserDTO
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<Record<number, boolean>>(
    {}
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setIsTyping(false); // Zakończ wskaźnik pisania po debounce

    if (!debouncedSearchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      const results = await searchUsers(debouncedSearchQuery); // API zwraca UserDTO[]
      setSearchResults(results || []); // Ustaw UserDTO[] lub pustą tablicę
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedSearchQuery]); // Zależność od zdebouncowanego query

  const handleAddFriend = async (friendId: number) => {
    setSendingRequest((prev) => ({ ...prev, [friendId]: true }));
    const result = await sendFriendRequest(friendId);
    if (result.success) {
      toast.success(result.message);
      // Usuń użytkownika z listy po wysłaniu zaproszenia
      setSearchResults((prev) => prev.filter((user) => user.ID !== friendId));
    } else {
      toast.error(result.message);
      setSendingRequest((prev) => ({ ...prev, [friendId]: false })); // Odblokuj tylko przy błędzie
    }
    // Nie resetujemy sendingRequest[friendId] przy sukcesie, bo element znika
  };

  // Resetuj stan przy zamknięciu
  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsTyping(false);
    setIsSearching(false);
    setSendingRequest({});
    onClose(); // Wywołaj callback rodzica
  };

  // Aktualizuj stan pisania i czyść wyniki, jeśli input pusty
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
    // Użyj handleClose dla onOpenChange dla resetu przy zamknięciu
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md min-w-[400px]">
        {" "}
        {/* Stała minimalna szerokość */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Add New Friend
          </DialogTitle>
          <DialogDescription>
            Search for users by their username and send a friend request.
          </DialogDescription>
        </DialogHeader>
        {/* Search Input ze spinnerem */}
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
        {/* Kontener wyników ze stałą wysokością i scrollem */}
        <div className="mt-4 h-60 overflow-y-auto space-y-2 pr-2 border rounded-md p-2 dark:border-zinc-700">
          {/* Szkielet ładowania (tylko podczas zapytania API) */}
          {isSearching && (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {/* Komunikaty (tylko gdy nie ma ładowania API) */}
          {!isSearching &&
            searchResults.length === 0 &&
            debouncedSearchQuery && (
              <p className="text-center text-sm text-muted-foreground pt-10">
                No users found matching &quot;{debouncedSearchQuery}&quot;.
              </p>
            )}
          {/* Komunikat "pisz dalej" */}
          {!isSearching &&
            searchResults.length === 0 &&
            !debouncedSearchQuery &&
            searchQuery && (
              <p className="text-center text-sm text-muted-foreground pt-10">
                Keep typing to search...
              </p>
            )}
          {/* Komunikat początkowy */}
          {!isSearching && searchResults.length === 0 && !searchQuery && (
            <p className="text-center text-sm text-muted-foreground pt-10">
              Enter a username to search for friends.
            </p>
          )}

          {/* Lista wyników (tylko gdy nie ma ładowania API i są wyniki) */}
          {!isSearching &&
            searchResults.map(
              (
                user // 'user' jest typu UserDTO
              ) => (
                <div
                  key={user.ID}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                >
                  {/* Lewa strona: Avatar i Nazwa */}
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
                  {/* Prawa strona: Przycisk Add */}
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
              )
            )}
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
