import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Components
import Navbar from "~/components/navbar";
import Markup from "~/components/markup";

// Database
import { Poem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getPoemWithId } from "~/utils/poem.server";

// Authentication
import { authenticatedUser } from "~/auth/authenticator.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const poemId = params.poemId;
  let poem: Poem | null = null;

  try {
    if (poemId) poem = await getPoemWithId(poemId);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Response(null, { status: 404, statusText: "Poem not found" });
    } else {
      throw error;
    }
  }

  const user = await authenticatedUser(request);

  return json({ poem, user });
}

export default function ShowPoem() {
  const { poem, user } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar loggedUser={user} />
      <Markup content={poem?.content} />
    </>
  );
}
