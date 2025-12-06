import { UserDTO } from "./user";

export type UserSearchResult = Pick<UserDTO, "ID" | "username" | "avatarURL">;

export type CourseSearchResult = {
  ID: number;
  title: string;
  language: string;
};

export type SearchResults = {
  users: UserSearchResult[];
  courses: CourseSearchResult[];
};
