import { z } from "zod";

/**
 * User Schema used in Register Form.
 */
export const userSchemaRegister = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Must contain at least 6 chars")
    .max(24, "Must contain 24 chars max"),
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
