"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchAcceptedFriends,
  fetchSentRequests,
  fetchIncomingRequests,
} from "@/lib/api/friends";
import { FriendshipInfo } from "@/lib/types/user";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { IncomingRequestItem } from "@/components/ui/friends/incomingRequestItem";
import { FriendListItem } from "@/components/ui/friends/friendListItem";
import { AddFriendModal } from "@/components/ui/friends/addFriendModal";

export default function FriendsPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendshipInfo[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendshipInfo[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendshipInfo[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAllFriendData = useCallback(
    async (showLoadingSpinner = true) => {
      if (!user) return;

      if (showLoadingSpinner) setLoading(true);

      try {
        const [acceptedData, sentData, incomingData] = await Promise.all([
          fetchAcceptedFriends(),
          fetchSentRequests(),
          fetchIncomingRequests(),
        ]);

        setFriends(
          acceptedData?.sort((a, b) =>
            a.otherUser.username.localeCompare(b.otherUser.username)
          ) ?? []
        );
        setSentRequests(
          sentData?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) ?? []
        );
        setIncomingRequests(
          incomingData?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) ?? []
        );
      } catch (error) {
        console.error("Error loading friend data:", error);
        toast.error("Failed to load friend lists. Please try again.");
        setFriends([]);
        setSentRequests([]);
        setIncomingRequests([]);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      loadAllFriendData(true);
    } else {
      setLoading(false);
      setFriends([]);
      setSentRequests([]);
      setIncomingRequests([]);
    }
  }, [user, loadAllFriendData]);

  const handleActionComplete = () => {
    loadAllFriendData(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        {user && (
          <Button onClick={() => setIsModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </Button>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {!loading && user && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-zinc-700">
              Incoming Requests ({incomingRequests.length})
            </h2>
            {incomingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No incoming friend requests.
              </p>
            ) : (
              <div className="space-y-1">
                {incomingRequests.map((requestInfo) => (
                  <IncomingRequestItem
                    key={requestInfo.ID}
                    requestInfo={requestInfo}
                    onActionComplete={handleActionComplete}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-zinc-700">
              Your Friends ({friends.length})
            </h2>
            {friends.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                You haven&apos;t added any friends yet.
              </p>
            ) : (
              <div className="space-y-1">
                {friends.map((friendshipInfo) => (
                  <FriendListItem
                    key={friendshipInfo.ID}
                    friendshipInfo={friendshipInfo}
                    onActionComplete={handleActionComplete}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-zinc-700">
              Sent Requests ({sentRequests.length})
            </h2>
            {sentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No pending requests sent.
              </p>
            ) : (
              <div className="space-y-1">
                {sentRequests.map((requestInfo) => (
                  <FriendListItem
                    key={requestInfo.ID}
                    friendshipInfo={requestInfo}
                    onActionComplete={handleActionComplete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !user && (
        <div className="text-center text-muted-foreground py-10">
          Please log in to see your friends.
        </div>
      )}

      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          handleActionComplete();
        }}
      />
    </div>
  );
}
