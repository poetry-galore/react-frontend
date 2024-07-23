import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Components
import Navbar from "~/components/navbar";

// Authentication
import { authenticator } from "~/auth/authenticator.server";

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

  return json({
    user,
  });
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar loggedUser={user} />
      <h1 className="text-3xl">Poetry Galore</h1>
    </>
  );
}
