import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

// Components
import AuthForm from "../_auth/components/form";

// Authentication
import {
  EMAIL_PASSWORD_STRATEGY,
  authenticator,
  clearAuthSessionError,
  setAuthSessionError,
} from "~/auth/authenticator.server";
import { commitSession } from "~/auth/session.server";
import { register } from "./register.server";
import { validator } from "./userSchema";

export const meta: MetaFunction = () => {
  return [
    { title: "Register" },
    { name: "description", content: "Registration page for Poetry Galore" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  return json(
    { defaultValues },
    {
      headers: {
        "Set-Cookie": await commitSession(await clearAuthSessionError(request)),
      },
    },
  );
};

export const action: ActionFunction = async ({ request }) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const error = await register(fieldValues.data);

  if (error) {
    const message = (await error.json()).error;

    return json(error, {
      headers: {
        "Set-Cookie": await commitSession(
          await setAuthSessionError({ message }, request),
        ),
      },
    });
  }

  // TODO: New users are to be redirected to onboarding
  return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
    successRedirect: "/profile",
    context: { formData },
  });
};

export default function Register() {
  const { defaultValues } = useLoaderData<typeof loader>();

  return (
    <AuthForm
      defaultValues={defaultValues}
      validator={validator}
      title="Create an account"
      description="Create a new account"
      action="Register"
    />
  );
}
