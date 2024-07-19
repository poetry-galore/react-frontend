import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

// CSS
import "~/tailwind.css";

// Authentication
import { authenticator } from "~/auth/authenticator.server";

// Theme
import { themeSessionResolver } from "~/theme/session.server";

export const links: LinksFunction = () => [{ rel: "icon", href: "/icon.svg" }];

/**
 * Error display
 */
export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body className="text-slate-800 bg-white dark:text-slate-100 dark:bg-dark h-dvh">
        {isRouteErrorResponse(error) ? (
          <div>
            <h1 className="text-xl font-bold">
              {error.status} {error.statusText}
            </h1>
            <p>{error.data}</p>
          </div>
        ) : error instanceof Error ? (
          <div>
            <h1 className="text-xl font-bold">Error</h1>
            <p>{error.message}</p>
          </div>
        ) : (
          <h1>Unknown Error</h1>
        )}
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const clonedRequest = request.clone();

  const { getTheme } = await themeSessionResolver(request);
  const user = await authenticator.isAuthenticated(clonedRequest);

  return json({
    theme: getTheme(),
    user: user,
  });
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="text-slate-800 bg-white dark:text-slate-100 dark:bg-dark h-dvh">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * App wrapped by the ThemeProvider
 */
export default function AppWithThemeProvider() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}
