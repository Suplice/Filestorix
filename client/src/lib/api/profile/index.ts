import { ProfileData } from "@/lib/types/profile";

export const fetchUserProfile = async (
  userId: number
): Promise<ProfileData | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) {
      const error = await response.json();
      console.error(
        "Error fetching profile:",
        error.error || response.statusText
      );
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Network error fetching profile:", error);
    return null;
  }
};
