import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

// Components
import Navbar from "~/components/navbar";
import Markup from "~/components/markup";
import { Button } from "~/components/ui/button";

// Database
import { getPoemWithIdOrThrow } from "~/utils/poem.server";

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

  const poem = await getPoemWithIdOrThrow(poemId ? poemId : "");
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

            {/** Show action buttons if user is logged in and is the author */}
            {user && user.userId === poem.authorId && (
              <>
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

                {/** Delete */}
                <Form
                  action="delete"
                  method="post"
                  onSubmit={(event) => {
                    const response = confirm(
                      "Please confirm you want to delete this poem.",
                    );
                    if (!response) {
                      event.preventDefault();
                    }
                  }}
                >
                  <Button
                    size={"sm"}
                    className="my-4 me-3 text-base font-semibold hover:text-primary dark:hover:text-primary"
                    variant={"ghost"}
                    type="submit"
                  >
                    Delete
                  </Button>
                </Form>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
