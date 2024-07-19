import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticationRequired } from "~/auth/authenticator.server";

export default function Protected() {
  return <>Protected</>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticationRequired(request);
};
