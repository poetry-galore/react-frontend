import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

/**
 * User Schema used in Login Form
 */
export const userSchemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Must provide password"),
});

export type LoginAuth = z.infer<typeof userSchemaLogin>;

export const validator = withZod(userSchemaLogin);
