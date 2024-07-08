import bcrypt from "bcryptjs";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { sessionStorage } from "~/auth/session.server";
import { prisma } from "~/db/prisma.server";

export type User = {
  userId: string;
  email: string;
};

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw Error("Invalid credentials");
    }

    return { userId: user.id, email: user.email };
  }),
  EMAIL_PASSWORD_STRATEGY
);

/**
 * Checks whether the user is authenticated and if not so redirects
 * to the `/login` page with the requested pathname in the `redirectTo`
 * search parameter.
 *
 * @returns The User object if they're authenticated else null
 */
export async function authenticationRequired(request: Request) {
  const redirectTo = new URL(request.url).pathname;
  const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

  return await authenticator.isAuthenticated(request, {
    failureRedirect: `/login?${searchParams}`,
  });
}
