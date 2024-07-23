import bcrypt from "bcryptjs";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { getSession, sessionStorage } from "~/auth/session.server";
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
  EMAIL_PASSWORD_STRATEGY,
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

/**
 * Sets the `authenticator.sessionErrorKey` in the session to value.
 *
 * @param value The value to set
 * @param request Request
 * @returns New session with the sessionErrorKey set to value
 */
export async function setAuthSessionError(value: any, request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  session.set(authenticator.sessionErrorKey, value);

  return session;
}

/**
 * Sets the `authenticator.sessionErrorKey` to `undefined`.
 *
 * @param request Request
 * @returns New session with the sessionErrorKey set to undefined
 */
export async function clearAuthSessionError(request: Request) {
  return await setAuthSessionError(undefined, request);
}
