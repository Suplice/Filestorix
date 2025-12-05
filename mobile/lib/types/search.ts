// Ścieżka: lib/types/search.ts
import { UserDTO } from "./user"; // Use UserDTO for consistency if you have it

// Type matching backend's UserSearchResult
export type UserSearchResult = Pick<UserDTO, "ID" | "username" | "avatarURL">;

// Type matching backend's CourseSearchResult
export type CourseSearchResult = {
  ID: number;
  title: string;
  language: string;
};

// Type matching backend's SearchResultsDTO
export type SearchResults = {
  users: UserSearchResult[];
  courses: CourseSearchResult[];
};
