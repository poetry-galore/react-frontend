// app/routes/profile.tsx
import { Form, useActionData } from "@remix-run/react";
import { authenticationRequired } from "~/auth/authenticator.server";
import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    redirect,
  } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
    // Fetch user data to pre-fill the form
    
    const user = await authenticationRequired(request);
    return json({ user });
  }
  
  export async function action({ request }: ActionFunctionArgs) {
    const formData = new URLSearchParams(await request.text());
    const name = formData.get('name');
    const email = formData.get('email');
    
    // Update user data in your database
    const userId = /* get the user ID from session or authentication */;
    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
  
    return redirect('/profile');
  }
export default function Profile() {
  const data = useActionData();

  return (
    <div>
      <h1>Update Profile</h1>
      <Form method="post">
        <label>
          Username:
          <input type="text" name="name" defaultValue={data?.user?.name || ''} />
        </label>
        <label>
          Email:
          <input type="email" name="email" defaultValue={data?.user?.email || ''} />
        </label>
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
