import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/authenticator.server";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";

// Components
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import { formSchema } from "~/profile/ProfileSchema";
import { updateUser, userUpdate, UpdateForm } from "~/utils/user.server";
import { Textarea } from "~/components/ui/textarea";


export async function loader({ request }: LoaderFunctionArgs) {
  const clonedRequest = request.clone();

  // Get authenticated user if there is one
  const user = await authenticator.isAuthenticated(clonedRequest);

  return json({
    user,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();

  const user = authenticator.isAuthenticated(clonedRequest);
  console.log(user);
  const formData = await request.formData();

  const userDetails: UpdateForm = {
    profilePicture: formData.get("profilePicture") as string,
    penName: formData.get("penName") as string,
    bio: formData.get("bio") as string,
    location: formData.get("location") as string,
    languages: formData.get("languages") as string,
  };

  const updatedUser = await updateUser(userDetails);

  return redirect("/");
}

export default function Profile() {
  const user = useLoaderData<typeof loader>;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
  })
  return (
    <>
      <Navbar loggedUser={user} />
      <div>
        <Form {...form}>        
        <form
          method="post"
          className="space-y-6 ">
          
          <FormField 
          control={form.control}
          name="profilePicture"
          render={({field}) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input placeholder="profile picture"{...field}/>
              </FormControl>
              <FormDescription>
                This is your profile picture publicly displayed to other people
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField 
          control={form.control}
          name="penName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Pen name</FormLabel>
              <FormControl>
                <Input placeholder="pen name"{...field}/>
              </FormControl>
              <FormDescription>
                This is your pen name. publicly displayed to other people
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField 
          control={form.control}
          name="bio"
          render={({field}) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Type what you want people to know about you here" {...field}/>
              </FormControl>
              <FormDescription>
                This is your bio. I t describes who you are to other users.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}/>
          <FormField 
          control={form.control}
          name="location"
          render={({field}) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Where you are located" {...field}/>
              </FormControl>
              <FormDescription>
                This is your local area
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}/>
          

        </form>
        </Form>

      </div>
    </>
  );
}
