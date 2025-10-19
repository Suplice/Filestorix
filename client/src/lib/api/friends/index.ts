import { FriendshipInfo, UserDTO } from "@/lib/types/user"; // Załóżmy, że typy są w types/user

export const fetchAcceptedFriends = async (): Promise<
  FriendshipInfo[] | null
> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/accepted`,
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

// 1b. Pobierz wysłane zaproszenia
export const fetchSentRequests = async (): Promise<FriendshipInfo[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/sent`,
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

// 1c. Pobierz przychodzące zaproszenia
export const fetchIncomingRequests = async (): Promise<
  FriendshipInfo[] | null
> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/incoming`,
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

// --- ZAKTUALIZOWANE WYSZUKIWANIE ---
// 2. Wyszukaj użytkowników po nazwie - zwraca UserDTO[]
export const searchUsers = async (query: string): Promise<UserDTO[] | null> => {
  if (!query.trim()) return [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/search?q=${encodeURIComponent(
        query
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json(); // Zwraca UserDTO[]
  } catch (error) {
    console.error("searchUsers error:", error);
    return null;
  }
};

// 3. Wyślij zaproszenie do znajomych
export const sendFriendRequest = async (
  friendId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ friendId: friendId }), // Backend oczekuje 'friendId'
      }
    );

    const data = await response.json(); // Odczytaj odpowiedź JSON

    if (!response.ok) {
      console.error(
        "Error sending friend request:",
        data.error || response.statusText
      );
      // Zwróć błąd z backendu, jeśli istnieje
      return {
        success: false,
        message: data.error || "Failed to send request.",
      };
    }
    // Zwróć sukces z wiadomością z backendu
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
      `${process.env.NEXT_PUBLIC_API_URL}/friends/request/${friendshipId}`,
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
      `${process.env.NEXT_PUBLIC_API_URL}/friends/request/${friendshipId}`,
      {
        method: "PATCH", // Używamy PATCH do aktualizacji statusu
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: action }), // Backend oczekuje 'action'
      }
    );

    // Odczytaj odpowiedź JSON niezależnie od statusu ok
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
    // Upewnij się, że URL pasuje do definicji w routerze Go
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/${friendshipId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    // Odpowiedź DELETE może nie mieć ciała JSON przy sukcesie (200 OK lub 204 No Content)
    // Ale przy błędzie (4xx, 5xx) może mieć
    let data = { message: "Friend removed successfully.", error: "" }; // Domyślna odpowiedź sukcesu
    if (!response.ok) {
      try {
        data = await response.json(); // Spróbuj odczytać błąd JSON
      } catch {
        // Jeśli nie ma JSON, użyj statusText
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
