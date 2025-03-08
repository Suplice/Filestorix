import { z } from "zod";

export const addCatalogSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be longer than 1 character")
    .max(50, "Name must be shorter than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_ ]+$/,
      "Name can only contain letters, numbers, spaces, dashes, and underscores"
    ),
});

export const renameFileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be longer than 1 character")
    .max(50, "Name must be shorter than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_ ]+$/,
      "Name can only contain letters, numbers, spaces, dashes, and underscores"
    ),
});
