import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { useLoaderData } from "@remix-run/react";

// Components
import { AuthCard } from "~/components/card";
import { AuthInput } from "~/components/input";
import { Button } from "~/components/ui/button";

// Authentication
import { userSchemaRegister } from "~/auth/authSchema";
import { register } from "~/auth/register.server";
import {
  EMAIL_PASSWORD_STRATEGY,
  authenticator,
} from "~/auth/authenticator.server";
import { commitSession, getSession } from "~/auth/session.server";

const validator = withZod(userSchemaRegister);

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

  return json({ defaultValues });
};

export const action: ActionFunction = async ({ request }) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const error = await register(fieldValues.data);

  if (error) {
    const message = (await error.json()).error;

    const session = await getSession(request.headers.get("cookie"));
    session.set(authenticator.sessionErrorKey, { message });

    return json(
      error,
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }

  // TODO: New users are to be redirected to onboarding
  return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
    successRedirect: "/",
    context: { formData },
  });
};

export default function Register() {
  const { defaultValues } = useLoaderData<typeof loader>();

  return (
    <>
      <AuthCard title="Create an account" description="Create a new account">
        <ValidatedForm
          className="w-full"
          method="POST"
          validator={validator}
          defaultValues={defaultValues}
        >
          <AuthInput
            name="email"
            label="Email"
            placeholder="Your email..."
            className="mb-4"
          />
          <AuthInput
            name="password"
            label="Password"
            type="password"
            placeholder="Your password..."
            className=""
          />
          <div className="flex flex-col items-center space-y-4 mt-10">
            <Button
              className="w-full text-lg rounded-lg"
              type="submit"
              variant={"default"}
              size={"lg"}
            >
              Register
            </Button>
          </div>
        </ValidatedForm>
      </AuthCard>
    </>
  );
}
