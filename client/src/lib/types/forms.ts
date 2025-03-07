import { z } from "zod";
import {
  userEmailRegistrationSchema,
  userEmailLoginSchema,
} from "../schemas/userRelatedSchemas";
import { User } from "../types/user";
import { UserFile } from "./file";
import { addCatalogSchema } from "../schemas/fileRelatedSchemas";

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

/**
 * Represents the response received after attempting to add a file.
 *
 * @property {UserFile[]} [files] - An optional array of user files that were successfully added.
 * @property {string} [message] - An optional message providing additional information about the response.
 * @property {string} [error] - An optional error message if the file addition was unsuccessful.
 */
export type AddFileResponse = {
  files?: UserFile[];
  message?: string;
  error?: string;
};

/**
 * Represents the form data for adding a catalog.
 *
 * This type is inferred from the `addCatalogSchema` using Zod's `infer` method.
 * It ensures that the form data adheres to the structure and validation rules defined in the schema.
 */
export type AddCatalogForm = z.infer<typeof addCatalogSchema>;

/**
 * Represents the response received after attempting to add a catalog.
 *
 * @property {string} [message] - An optional message indicating the result of the operation.
 * @property {string} [error] - An optional error message if the operation failed.
 */
export type AddCatalogResponse = {
  message?: string;
  error?: string;
};
