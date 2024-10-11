import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

// Components
import Navbar from "~/components/navbar";
import Markup from "~/components/markup";
import { Button } from "~/components/ui/button";
import { PoemCard } from "~/components/card";
import { DeleteIcon, Edit3Icon } from "lucide-react";

// Database
import { getPoemAndAuthorOrThrow } from "~/utils/poem.server";

// Authentication
import { authenticatedUser } from "~/auth/authenticator.server";
import { getUserDetails } from "~/utils/user.server";

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

  const poem = await getPoemAndAuthorOrThrow(poemId ? poemId : "");
  const user = await authenticatedUser(request);
  const userDetails = await getUserDetails(user.userId);

  return json({ poem, user, userDetails });
}

export default function ShowPoem() {
  const { poem, user, userDetails } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar
        loggedUser={user}
        showCreatePoem={false}
        userdetails={userDetails}
      />
      <div className="flex gap-6 justify-center">
        <PoemCard
          className="outfit"
          // @ts-expect-error
          poem={poem}
        >
          <Markup content={poem?.content} />
        </PoemCard>
        {/** Show action buttons if user is logged in and is the author */}
        {user && user.userId === poem.authorId && (
          <div className="flex items-start">
            {/** Edit Button */}
            <Link to={EDIT_POEM_ROUTE(poem.id)}>
              <Button
                size={"sm"}
                className="my-4 me-3 text-base font-semibold hover:text-primary dark:hover:text-primary"
                variant={"link"}
              >
                <Edit3Icon className="h-4 w-4 me-1" />
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
                className="my-4 me-3 text-base font-semibold hover:text-red-600 dark:hover:text-red-600"
                variant={"link"}
                type="submit"
              >
                <DeleteIcon className="h-4 w-4 me-1 mb-1" />
                Delete
              </Button>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}
