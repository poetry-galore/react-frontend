import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/authenticator.server";
import Navbar from "~/components/navbar";

export const meta: MetaFunction = () => {
  return [
    { title: "Poetry Galore" },
    { name: "description", content: "Great poems for all poetry lovers" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const  clonedRequest = request.clone();

  const user = await authenticator.isAuthenticated(clonedRequest);

  return json({
    user,
  });
}
export default function Index() {

  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
    <div className="container px-6 py-10 mx-auto animate-pulse">
        <h1 className="w-48 h-2 mx-auto bg-gray-200 rounded-lg dark:bg-gray-700">Poetry galore</h1>

        <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700">Your one stop shop for poems and everything literature</p>
        <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg sm:w-80 dark:bg-gray-700"></p>

        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>

            <div className="w-full ">
                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                
                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>
        </div>
    </div>
</section>
    </div>
  );
}
