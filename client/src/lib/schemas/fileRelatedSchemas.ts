import { z } from "zod";

export const addCatalogSchema = z.object({
  name: z.string().min(2, "Name must be longer than 1 character"),
});
