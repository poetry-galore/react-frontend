import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";

//Components
import AuthForm from "../_auth/components/form";

// Authentication
import {
  EMAIL_PASSWORD_STRATEGY,
  authenticator,
  clearAuthSessionError,
  setAuthSessionError,
} from "~/auth/authenticator.server";
import { commitSession } from "~/auth/session.server";
import { validator } from "./userShema";

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login page for Poetry Galore" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();

  const redirectTo = (await clonedRequest.formData()).get(
    "redirectTo",
  ) as string;

  try {
    await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
      successRedirect: redirectTo,
      failureRedirect: "/login",
    });
  } catch (error: any) {
    // Don't redirect when authentication fails
    if (error.headers.get("location") !== "/login") {
      return error;
    }
  }

  const error = { message: "Invalid credentials" };

  return json(error, {
    headers: {
      "Set-Cookie": await commitSession(
        await setAuthSessionError(error, request),
      ),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;

  const redirectTo = searchParams.get("redirectTo")
    ? (searchParams.get("redirectTo") as string)
    : "/";

  await authenticator.isAuthenticated(request, {
    successRedirect: redirectTo,
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  return json(
    { defaultValues, redirectTo },
    {
      headers: {
        "Set-Cookie": await commitSession(await clearAuthSessionError(request)),
      },
    },
  );
}

export default function Login() {
  const { defaultValues, redirectTo } = useLoaderData<typeof loader>();

  return (
    <AuthForm
      defaultValues={defaultValues}
      validator={validator}
      title="Login"
      description="Login to your account"
      action="Login"
      redirectTo={redirectTo}
    />
  );
}
