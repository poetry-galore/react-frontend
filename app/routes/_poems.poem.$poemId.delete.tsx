import { ActionFunctionArgs, redirect } from "@remix-run/node";

// Database
import {
  deletePoemForUser,
  getPoemWithIdForUserOrThrow,
} from "~/utils/poem.server";

// Authentication
import { authenticationRequired } from "~/auth/authenticator.server";

/**
 * Deletes a poem.
 *
 * There has to be an authenticated in user and that user is supposed
 * to be the author of the poem to be deleted.
 */
export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticationRequired(request);

  const poemId = params.poemId;
  const poem = await getPoemWithIdForUserOrThrow(poemId ? poemId : "", user);

  try {
    await deletePoemForUser(poem, user);
  } catch (error: unknown) {
    // user is not author of the poem.
    return error;
  }

  // TODO: Redirect to the previous route before the 'poem/$poemId' route was visited
  return redirect("/");
}
