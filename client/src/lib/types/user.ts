import { z } from "zod";
import { userSchema } from "../schemas/userRelatedSchemas";

/**
 * User object
 */
export type User = z.infer<typeof userSchema>;
