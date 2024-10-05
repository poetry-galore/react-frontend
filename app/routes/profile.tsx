import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Authentication
import { authenticationRequired } from "~/auth/authenticator.server";

// Components
import { LogoIcon } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggler";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

// Profile
import { formSchema } from "~/profile/ProfileSchema";
import {
  commitUserDetailsSession,
  getUserDetailsSession,
} from "~/profile/session.server";

// Database
import { updateUser } from "~/utils/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const clonedRequest = request.clone();

  const user = await authenticationRequired(clonedRequest);

  return json({
    user,
  });
}

export type finalForm = {
  penName: string | null;
  bio: string | null;
};

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();

  const user = await authenticationRequired(clonedRequest);

  const formData = await request.formData();

  const userDetails: finalForm = {
    penName: formData.get("penName") as string,
    bio: formData.get("bio") as string,
  };

  /**
   * const photoPath = await uploadPhoto(userDetails.profilePicture)
    .then((obj) => obj.fullPath)
    .catch((_err) => _err.error);
   */

  const updatedUser = await updateUser(
    {
      ...userDetails,
      profilePicture: "",
    },
    user.userId,
  );
  console.log(updatedUser);

  const session = await getUserDetailsSession(request);

  session.set("penName", userDetails.penName);
  session.set("bio", userDetails.bio);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitUserDetailsSession(session),
    },
  });
}

export default function Profile() {
  const user = useLoaderData<typeof loader>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      penName: "",
      bio: "",
    },
  });

  return (
    <div className="">
      <div className="w-1/12 lg:w-1/4 sticky top-10">
        <Link to="/">
          <LogoIcon className="max-w-20" />
        </Link>

        <ThemeToggle className="ms-2.5 mt-5" />
      </div>
      <div className="flex flex-col items-center justify-center ">
        <Form {...form}>
          <form
            method="post"
            encType="multipart/form-data"
            className="space-y-8 justify-center p-4 "
          >
            <FormField
              control={form.control}
              name="penName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pen name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>Choose a unique pen name!</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder=". . ." {...field} />
                  </FormControl>
                  <FormDescription>
                    What do you want other users to know about you?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
