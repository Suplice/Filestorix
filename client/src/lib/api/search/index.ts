import { SearchResults } from "@/lib/types/search";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const searchCommandItems = async (
  query: string
): Promise<SearchResults | null> => {
  if (!query.trim()) {
    return { users: [], courses: [] };
  }
  try {
    const response = await fetch(
      `${API_URL}/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      console.error("Error during search:", errorData.error);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Network error during search:", error);
    return null;
  }
};
