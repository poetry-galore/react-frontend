import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

const THEME_SESSION_SECRET = process.env.THEME_SESSION_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !THEME_SESSION_SECRET) {
  throw Error("Must set THEME_SESSION_SECRET in production");
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "poetry_galore_theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [THEME_SESSION_SECRET || "s3cr3t"],
    ...(isProduction ? { secure: true } : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
