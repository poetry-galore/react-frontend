import { createCookieSessionStorage } from "@remix-run/node";

const USER_SESSION_SECRET = process.env.USER_SESSION_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !USER_SESSION_SECRET) {
  throw Error("Must set USER_SESSION_SECRET in production");
}

/**
 * Session storage for the authentication cookie.
 */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_poetry_galore_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [USER_SESSION_SECRET || "s3cr3t"],
    ...(isProduction ? { secure: true } : {}),
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
