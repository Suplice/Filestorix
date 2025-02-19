import { z } from "zod";
import {
  userEmailRegistrationSchema,
  userEmailLoginSchema,
} from "../schemas/userRelatedSchemas";

/**
 * type for user registration form
 *
 * This type is used in the SignUpForm component
 * to define the shape of the form data
 */
export type signUpForm = z.infer<typeof userEmailRegistrationSchema>;

/**
 * type for user login form
 *
 * This type is used in the LoginForm component
 * to define the shape of the form data
 */
export type signInForm = z.infer<typeof userEmailLoginSchema>;
