import { z } from "zod";
import { providers } from "../types/provider";
import { roles } from "../types/role";

/**
 * Schema for user object
 *
 * User object must have the following properties:
 * - id: number
 * - username: string
 * - email: string
 * - createdAt: string
 * - updatedAt: string
 * - provider: Provider
 * - avatarURL: string | null | undefined
 * - role: Role
 * - passwordHash: string | null | undefined
 * - lastLoginAt: string
 *
 */
export const userSchema = z.object({
  ID: z.number(),
  username: z.string(),
  email: z.string(),
  createdAt: z.string().transform((value) => new Date(value)),
  updatedAt: z.string().transform((value) => new Date(value)),
  provider: z.enum(providers),
  avatarURL: z.string().url().optional().nullable(),
  role: z.enum(roles),
  passwordHash: z.string().optional().nullable(),
  lastLoginAt: z.string().transform((value) => new Date(value)),
  GoogleId: z.string(),
  GithubId: z.string(),
});

/**
 * Schema for password validation
 *
 * Password must be at least 6 characters long
 * and contain at least one lowercase letter,
 * one uppercase letter, one number
 * and one special character
 *
 */
const passwordSchema = z
  .string()
  .min(6, "Password is too short, minimum length is 6 characters")
  .max(255, "Password is too long, maximum length is 255 characters")
  .regex(/(?=.*[a-z])/, "Password has to contain at least one lowercase letter")
  .regex(/(?=.*[A-Z])/, "Password has to contain at least one uppercase letter")
  .regex(/(?=.*[0-9])/, "Password has to contain at least one number")
  .regex(
    /(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-])/,
    "Password has to contain at least one special character"
  );

/**
 * Schema for email validation
 *
 * Email must be a valid email address
 * and be between 5 and 255 characters long
 */
const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(5, "Email is too short")
  .max(255, "Email is too long");

/**
 * Schema for user registration
 * using `emailSchema` and `passwordSchema` validation schemas
 */
export const userEmailRegistrationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Schema for user login
 *
 * User login must have the following properties:
 * - email: string
 * - password: string
 *
 */
export const userEmailLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
