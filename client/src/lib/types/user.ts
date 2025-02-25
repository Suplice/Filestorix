import { z } from "zod";
import { userSchema } from "../schemas/userRelatedSchemas";

/**
 * User object
 */
export type User = z.infer<typeof userSchema>;

export type fetchUserResponse = {
  user?: User;
  error?: string;
  message?: string;
};

export type fetchUserResult = fetchUserResponse & {
  ok?: boolean;
};
