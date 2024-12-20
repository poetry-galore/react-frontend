import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Components
import { PoemCard } from "~/components/card";
import Markup from "~/components/markup";
import Navbar from "~/components/navbar";

// Authentication
import { authenticator } from "~/auth/authenticator.server";

// Database
import { getPoemsAndAuthors } from "~/utils/poem.server";
import { getUserDetails } from "~/utils/user.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Poetry Galore" },
    { name: "description", content: "Great poems for all poetry lovers" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const clonedRequest = request.clone();

  // Get authenticated user if there is one
  const user = await authenticator.isAuthenticated(clonedRequest);
  const poems = await getPoemsAndAuthors(15);

  if (!user) {
    return json({
      user,
      poems,
      userDetails: null,
    });
  }

  const userDetails = await getUserDetails(user.userId);

  return json({
    user,
    poems,
    userDetails,
  });
}

export default function Index() {
  const { user, poems, userDetails } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar loggedUser={user} userdetails={userDetails} />
      <div className="flex flex-col items-center justify-center">
        {poems.map((poem) => (
          <PoemCard
            key={poem.id}
            // @ts-expect-error JsonifyObject Type does not match the PoemWithAuthor
            poem={poem}
          >
            <Markup content={poem.content} />
          </PoemCard>
        ))}
      </div>
    </>
  );
}
