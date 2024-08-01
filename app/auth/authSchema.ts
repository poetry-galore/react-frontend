import { z } from "zod";

export const detailsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  profilePicture: z.string().url("Must be a valid URL"),
  bio: z.string().optional(),
  dateOfBirth: z.date(),
  location: z.string().optional(),
  gender: z.enum(["male", "female", "non-binary", "other"]), // Adjust as needed
  penName: z.string().optional(),
  languages: z.array(z.string()).nonempty("At least one language is required"),
  favoriteQuotes: z.array(z.string()).optional(),
});
/**
 * User Schema used in Register Form.
 */
export const userSchemaRegister = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Must contain at least 6 chars")
    .max(24, "Must contain 24 chars max"),
  details: detailsSchema.optional(),
});

/**
 * User Schema used in Login Form
 */
export const userSchemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Must provide password"),
});

export type RegisterAccountAuth = z.infer<typeof userSchemaRegister>;

export type LoginAuth = z.infer<typeof userSchemaLogin>;
