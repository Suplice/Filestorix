import { z } from "zod";
import { userSchema } from "../schemas/userRelatedSchemas";
import { BaseResponse } from "./common";

/**
 * User object
 */
export type User = z.infer<typeof userSchema>;

export type fetchUserResponse = BaseResponse & {
  user?: User;
};

export type fetchUserResult = fetchUserResponse & {
  ok?: boolean;
};

/**
 * Represents the response from a sign form submission.
 *
 * @property {User} [user] - The user object if the sign form submission is successful.
 * @property {string} [message] - An optional message providing additional information about the response.
 * @property {string} [error] - A string describing the error if the sign form submission fails.
 * @property {number} [sessionExpiresAt] - A number which describes date when auth cookie will expire
 */
export type signFormResponse = BaseResponse & {
  user?: User;
};

/**
 * Represents the result of a sign form operation.
 *
 * @property {boolean} ok - Indicates whether the operation was successful.
 * @property {string} [error] - An optional error message if the operation failed.
 * @property {User} [user] - An optional user object if the operation was successful.
 * @property {string} [message] - An optional message received after success
 */
export type signFormResult = signFormResponse & {
  ok?: boolean;
};
