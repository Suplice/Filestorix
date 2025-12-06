import { FriendshipInfo, UserDTO } from "@/lib/types/user";

export const fetchAcceptedFriends = async (): Promise<
  FriendshipInfo[] | null
> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/friends/accepted`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("fetchAcceptedFriends error:", error);
    return null;
  }
};
export const fetchSentRequests = async (): Promise<FriendshipInfo[] | null> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/friends/sent`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("fetchSentRequests error:", error);
    return null;
  }
};

export const fetchIncomingRequests = async (): Promise<
  FriendshipInfo[] | null
> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/friends/incoming`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("fetchIncomingRequests error:", error);
    return null;
  }
};

export const searchUsers = async (query: string): Promise<UserDTO[] | null> => {
  if (!query.trim()) return [];
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/users/search?q=${encodeURIComponent(
        query
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("searchUsers error:", error);
    return null;
  }
};

export const sendFriendRequest = async (
  friendId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/friends/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friendId: friendId }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Error sending friend request:",
        data.error || response.statusText
      );
      return {
        success: false,
        message: data.error || "Failed to send request.",
      };
    }
    return {
      success: true,
      message: data.message || "Request sent successfully!",
    };
  } catch (error) {
    console.error("Network error sending friend request:", error);
    return { success: false, message: "Network error." };
  }
};

export const cancelFriendRequest = async (
  friendshipId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/friends/request/${friendshipId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Error cancelling friend request:",
        data.error || response.statusText
      );
      return {
        success: false,
        message: data.error || "Failed to cancel request.",
      };
    }
    return {
      success: true,
      message: data.message || "Request cancelled successfully!",
    };
  } catch (error) {
    console.error("Network error cancelling friend request:", error);
    return { success: false, message: "Network error." };
  }
};

export const respondToFriendRequest = async (
  friendshipId: number,
  action: "accept" | "decline"
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/friends/request/${friendshipId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: action }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Error responding to friend request:",
        data?.error || response.statusText
      );
      return {
        success: false,
        message: data?.error || `Failed to ${action} request.`,
      };
    }
    return {
      success: true,
      message: data?.message || `Request ${action}ed successfully!`,
    };
  } catch (error) {
    console.error("Network error responding to friend request:", error);
    return { success: false, message: "Network error." };
  }
};

export const removeFriend = async (
  friendshipId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/friends/${friendshipId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    let data = { message: "Friend removed successfully.", error: "" };
    if (!response.ok) {
      try {
        data = await response.json();
      } catch {
        data = {
          message: "",
          error: response.statusText || "Failed to remove friend.",
        };
      }
    } else if (response.status === 200) {
      try {
        data = await response.json();
      } catch {}
    }

    if (!response.ok) {
      console.error(
        "Error removing friend:",
        data?.error || response.statusText
      );
      return {
        success: false,
        message: data?.error || "Failed to remove friend.",
      };
    }
    return {
      success: true,
      message: data?.message || "Friend removed successfully!",
    };
  } catch (error) {
    console.error("Network error removing friend:", error);
    return { success: false, message: "Network error." };
  }
};
