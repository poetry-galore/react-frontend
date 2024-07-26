import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

// Components
import Navbar from "~/components/navbar";
import Markup from "~/components/markup";
import { Button } from "~/components/ui/button";

// Database
import { Poem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getPoemWithId } from "~/utils/poem.server";

// Authentication
import { authenticatedUser } from "~/auth/authenticator.server";

// ROUTES
/**
 * Build the route to the page where to edit the poem.
 *
 * @param poemId id of the poem to edit
 * @returns Route where to edit a poem
 *
 * @example
 * console.log(EDIT_POEM_ROUTE("123")) // 'poem/123/edit`
 */
const EDIT_POEM_ROUTE = (poemId: string) => `/poem/${poemId}/edit`;

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
      <Navbar loggedUser={user} showCreatePoem={false} />
      <div className="text-center">
        {poem && (
          <>
            <h1 className="font-bold text-2xl mb-3">{poem?.title}</h1>
            {/** Parse and display the poem content */}
            <Markup content={poem?.content} />

            {/** Edit Button */}
            <Link to={EDIT_POEM_ROUTE(poem.id)}>
              <Button
                size={"sm"}
                className="my-4 me-3 text-base font-semibold hover:text-primary dark:hover:text-primary"
                variant={"secondary"}
              >
                Edit
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
