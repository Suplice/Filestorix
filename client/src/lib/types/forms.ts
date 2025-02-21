import { z } from "zod";
import {
  userEmailRegistrationSchema,
  userEmailLoginSchema,
} from "../schemas/userRelatedSchemas";
import { User } from "../types/user";

/**
 * Represents the form data for user sign-up.
 * This type is inferred from the `userEmailRegistrationSchema` using Zod.
 */
export type signUpForm = z.infer<typeof userEmailRegistrationSchema>;

/**
 * Represents the form data for signing in.
 * This type is inferred from the `userEmailLoginSchema`.
 */
export type signInForm = z.infer<typeof userEmailLoginSchema>;

/**
 * Represents the result of a sign form operation.
 *
 * @property {boolean} ok - Indicates whether the operation was successful.
 * @property {string} [error] - An optional error message if the operation failed.
 * @property {User} [user] - An optional user object if the operation was successful.
 * @property {string} [message] - An optional message received after success
 */
export type signFormResult = {
  ok: boolean;
  error?: string;
  user?: User;
  message?: string;
};

/**
 * Represents the response from a sign form submission.
 *
 * @property {User} [user] - The user object if the sign form submission is successful.
 * @property {string} [message] - An optional message providing additional information about the response.
 * @property {string} [error] - A string describing the error if the sign form submission fails.
 * @property {number} [sessionExpiresAt] - A number which describes date when auth cookie will expire
 */
export type signFormResponse = {
  user?: User;
  message?: string;
  error?: string;
  sessionExpiresAt?: number;
};
