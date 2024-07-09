import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Theme } from "remix-themes";

// Components
import { AlertError, AlertInfo } from "~/components/alert";
import { LogoFull } from "~/components/logo";
import { Button } from "~/components/ui/button";

// Authentication
import { authenticator } from "~/auth/authenticator.server";
import { getSession, commitSession } from "~/auth/session.server";
import { ThemeToggle } from "~/components/theme-toggler";

/**
 * Checks for authenticated users and also errors that may have risen
 * in the login process.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const redirectTo = searchParams.get("redirectTo")
    ? (searchParams.get("redirectTo") as string)
    : "/";

  await authenticator.isAuthenticated(request, {
    successRedirect: redirectTo,
  });

  let session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);

  return json(
    { error, redirectTo },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export default function AuthLayout() {
  const { error, redirectTo } = useLoaderData<typeof loader>();
  const location = useLocation();

  const [errorValue, setErrorValue] = useState<any>(error);

  useEffect(() => {
    setErrorValue(undefined);
  }, [location.pathname]);

  useEffect(() => {
    setErrorValue(error);
  }, [error]);

  return (
    <>
      <Link
        to={location.pathname === "/login" ? "/register" : "/login"}
        className="absolute top-10 right-10 font-semibold hover:underline underline-offset-2 z-50"
      >
        <Button
          className="w-full rounded-lg"
          type="button"
          variant={"default"}
          size={"default"}
        >
          {location.pathname === "/login" ? "Register" : "Login"}
        </Button>
      </Link>

      {redirectTo !== "/" && (
        <AlertInfo
          description="Login to continue"
          className="absolute top-32 lg:top-10 right-[50%] translate-x-1/2 md:w-[200px] mx-auto z-50 text-center"
        />
      )}

      <div className="relative w-full h-full flex justify-center items-center">
        <div className="relative hidden lg:flex flex-col justify-start items-end w-1/2 h-full bg-slate-800 dark:bg-slate-800 text-white">
          <ThemeToggle className="m-2 hover:text-white" />
          <Link to="/">
            <LogoFull
              className="w-1/2 absolute top-10 left-5"
              themeOverride={Theme.DARK}
            />
          </Link>
          <div className="absolute bottom-10 right-10 text-base xl:text-lg 2xl:text-xl font-mono italic font-thin">
            Enjoy creating and reading poems.
          </div>
        </div>

        <ThemeToggle className="absolute top-2 left-2 lg:hidden m-1" />
        <div className="relative w-full sm:w-2/3 flex flex-col items-center justify-center">
          <div className="relative w-full text-center">
            {errorValue && (
              <AlertError
                description={errorValue.message}
                className="absolute -top-14 right-[50%] translate-x-1/2 w-11/12 md:w-[450px]"
              />
            )}
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
