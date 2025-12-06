import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export enum Section {
  Home = "Home",
  Courses = "Courses",
  Leaderboard = "Leaderboad",
  Friends = "Friends",
  Profile = "Profile",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatFileSize = (size: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(1)} ${units[index]}`;
};
