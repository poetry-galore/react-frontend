import { createCookieSessionStorage } from "@remix-run/node";

const USER_SESSION_SECRET = process.env.USER_SESSION_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !USER_SESSION_SECRET) {
  throw Error("Must set USER_SESSION_SECRET in production");
}

export const userDetailsSession = createCookieSessionStorage({
  cookie: {
    name: "user_details",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [USER_SESSION_SECRET || "s3cr3t"],
    ...(isProduction ? { secure: true } : {}),
  },
});

export const getUserDetailsSession = async (request: Request) => {
  return userDetailsSession.getSession(request.headers.get("Cookie"));
};

export const commitUserDetailsSession = async (session: any) => {
  return userDetailsSession.commitSession(session);
};
