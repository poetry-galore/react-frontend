import { ValidatedForm, Validator } from "remix-validated-form";

// Components
import { Button } from "~/components/ui/button";
import { AuthCard } from "./card";
import { AuthInput } from "./input";

type AuthFormProps = {
  defaultValues: object;
  validator: Validator<object>;
  title: string;
  description?: string;
  action: "Register" | "Login";
  redirectTo?: string;
};

export default function AuthForm({
  defaultValues,
  validator,
  title,
  description,
  action,
  redirectTo,
}: AuthFormProps) {
  return (
    <>
      <AuthCard title={title} description={description}>
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
          {redirectTo && <input name="redirectTo" value={redirectTo} hidden />}
          <div className="flex flex-col items-center space-y-4 mt-10">
            <Button
              className="w-full text-lg rounded-lg"
              type="submit"
              variant={"default"}
              size={"lg"}
            >
              {action}
            </Button>
          </div>
        </ValidatedForm>
      </AuthCard>
    </>
  );
}
