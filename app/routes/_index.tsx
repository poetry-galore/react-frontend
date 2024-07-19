import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";

// Components
import Navbar from "~/components/navbar";
import { PoemCard } from "~/components/card";

// Authentication
import { authenticator } from "~/auth/authenticator.server";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Poetry Galore" },
    { name: "description", content: "Great poems for all poetry lovers" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const clonedRequest = request.clone();

  const user = await authenticator.isAuthenticated(clonedRequest);

  return json({
    user,
  });
}

const POEM = `<p>Look</p>`;

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar loggedUser={user} />
      <div className="font-sans text-lg p-4 w-full mx-auto grid grid-cols-10">
        {/* Left side panel */}
        <div className="col-span-0 sm:col-span-1 md:col-span-2 lg:col-span-3"></div>

        {/* Poems Column */}
        <div className="col-span-10 sm:col-span-8 md:col-span-6 lg:col-span-4 xl:p-4">
          <PoemCard
            title="First Love Is The Best Thing To Happen Here On This Day"
            description="One"
            content={POEM}
            author="One"
          />
        </div>

        {/* Right side panel */}
        <div className="col-span-0 sm:col-span-1 md:col-span-2 lg:col-span-3"></div>
      </div>
    </>
  );
}
