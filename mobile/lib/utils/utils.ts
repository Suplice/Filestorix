import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Enumy działają identycznie w RN (to czysty TypeScript)
export enum Section {
  // Main = "Main",
  // MyDrive = "MyDrive",
  // Recent = "Recent",
  // Favorite = "Favorite",
  // Trash = "Trash",
  Home = "Home",
  Courses = "Courses",
  Leaderboard = "Leaderboad",
  Friends = "Friends",
  Profile = "Profile",
}

// Ta funkcja jest KLUCZOWA dla NativeWind.
// Pozwala łączyć klasy Tailwind w React Native tak samo jak w Next.js.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Czysta matematyka - działa wszędzie tak samo.
export const formatFileSize = (size: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(1)} ${units[index]}`;
};
