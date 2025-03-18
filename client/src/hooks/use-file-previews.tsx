"use client";
import { useEffect, useState } from "react";
import { getFile } from "@/lib/api/file/filesApi";
import { UserFile } from "@/lib/types/file";

export const useFilePreviews = (files: UserFile[]) => {
  const [previews, setPreviews] = useState<Record<number, string>>({});

  useEffect(() => {
    let active = true;
    const fetchPreviews = async () => {
      const previewsMap: Record<number, string> = {};
      await Promise.all(
        files.map(async (file) => {
          try {
            const blob = await getFile(file.id + file.extension);
            const url = URL.createObjectURL(blob);
            previewsMap[file.id] = url;
          } catch (error) {
            console.error(`Failed to fetch file: ${file.name}`, error);
          }
        })
      );
      if (active) setPreviews(previewsMap);
    };

    fetchPreviews();

    return () => {
      active = false;
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  return previews;
};
