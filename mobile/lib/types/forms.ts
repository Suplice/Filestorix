import { z } from "zod";
import {
  userEmailRegistrationSchema,
  userEmailLoginSchema,
} from "../schemas/userRelatedSchemas";

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
