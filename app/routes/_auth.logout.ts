import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth/authenticator.server";

/**
 * Logs out the authenticated user.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};
