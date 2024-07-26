import { authenticationRequired } from "~/auth/authenticator.server";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// components
import { Button } from "~/components/ui/button";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticationRequired(request);
  return { user };
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> User Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-700 mb-2">
          <strong>Name:</strong> {user.username}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <Button variant="destructive">Update</Button>
    </div>
  );
}
