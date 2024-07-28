import { authenticationRequired } from "~/auth/authenticator.server";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Form, Link } from '@remix-run/react';
// components


import { Input } from "~/components/ui/input";




import { Button } from "~/components/ui/button";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticationRequired(request);
  return { user };
}


export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1>Hi {user.username}!</h1>
      <p>Change your details here</p>
      <Form method="post">
        <Input placeholder={user.username} />
        <Input placeholder={user.email} />
        <Button variant="destructive" type="submit">Update</Button>
      </Form>


    </div>
  );
}
