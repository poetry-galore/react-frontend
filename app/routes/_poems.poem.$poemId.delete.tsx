import { ActionFunctionArgs, redirect } from "@remix-run/node";

// Database
import { Poem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  deletePoem,
  getPoemWithId,
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

  await deletePoem(poem.id);

  // try {
  //   if (poemId) poem = await getPoemWithId(poemId);
  // } catch (error: any) {
  //   if (error instanceof PrismaClientKnownRequestError) {
  //     throw new Response(null, { status: 404, statusText: "Poem not found" });
  //   } else {
  //     throw error;
  //   }
  // }

  // if (poem?.authorId === user.userId) {
  //   await deletePoem(poem.id);
  // } else {
  //   throw new Response(null, { status: 403, statusText: "Not allowed" });
  // }

  // TODO: Redirect to the previous route before the 'poem/$poemId' route was visited
  return redirect("/");
}
