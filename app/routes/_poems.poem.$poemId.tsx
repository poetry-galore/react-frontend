import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

// Components
import { DeleteIcon, Edit3Icon } from "lucide-react";
import { PoemCard } from "~/components/card";
import { PoemDeleteDialog } from "~/components/dialog";
import Markup from "~/components/markup";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";

// Database
import { getPoemAndAuthorOrThrow } from "~/utils/poem.server";

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

  const poem = await getPoemAndAuthorOrThrow(poemId ? poemId : "");
  const user = await authenticatedUser(request);

  return json({ poem, user });
}

export default function ShowPoem() {
  const { poem, user } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar loggedUser={user} showCreatePoem={false} />
      <div className="flex gap-6 justify-center">
        <PoemCard
          className="outfit"
          // @ts-expect-error JsonifyObject Type does not match the PoemWithAuthor
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
            <PoemDeleteDialog
              trigger={
                <Button
                  size={"sm"}
                  className="my-4 me-3 text-base font-semibold hover:text-red-600 dark:hover:text-red-600"
                  variant={"link"}
                  type="submit"
                >
                  <DeleteIcon className="h-4 w-4 me-1 mb-1" />
                  Delete
                </Button>
              }
              action="delete"
              poemTitle={poem.title}
            />
          </div>
        )}
      </div>
    </>
  );
}
