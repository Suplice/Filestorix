import { z } from "zod";
import {
  userEmailRegistrationSchema,
  userEmailLoginSchema,
} from "../schemas/userRelatedSchemas";
import {
  addCatalogSchema,
  renameFileSchema,
} from "../schemas/fileRelatedSchemas";

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

export type RenameFileForm = z.infer<typeof renameFileSchema>;
