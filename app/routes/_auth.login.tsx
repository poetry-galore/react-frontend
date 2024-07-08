import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";

//Components
import { AuthCard } from "~/components/card";
import { AuthInput } from "~/components/input";
import { Button } from "~/components/ui/button";

// Authentication
import {
  EMAIL_PASSWORD_STRATEGY,
  authenticator,
} from "~/auth/authenticator.server";
import { userSchemaLogin } from "~/auth/authSchema";

const validator = withZod(userSchemaLogin);

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();

  let redirectTo = (await clonedRequest.formData()).get("redirectTo") as string;

  return await authenticator.authenticate(EMAIL_PASSWORD_STRATEGY, request, {
    successRedirect: redirectTo,
    failureRedirect: "/login",
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

  return json({ defaultValues, redirectTo });
}

export default function Login() {
  const { defaultValues, redirectTo } = useLoaderData<typeof loader>();

  return (
    <>
      <AuthCard title="Login" description="Authenticate into your account">
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
          <input hidden value={redirectTo} name="redirectTo" readOnly />
          <div className="flex flex-col items-center space-y-4 mt-10">
            <Button
              className="w-full text-lg rounded-lg"
              type="submit"
              variant={"default"}
              size={"lg"}
            >
              Login
            </Button>
          </div>
        </ValidatedForm>
      </AuthCard>
    </>
  );
}
