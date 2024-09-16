import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  authenticationRequired,
  authenticator,
} from "~/auth/authenticator.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "~/components/ui/form";

import { formSchema } from "~/profile/ProfileSchema";
import { updateUser, userUpdate, UpdateForm } from "~/utils/user.server";
import { Textarea } from "~/components/ui/textarea";
import { uploadPhoto } from "~/profile/supaBaseClient";
import React, { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const clonedRequest = request.clone();

  const user = await authenticationRequired(clonedRequest);

  return json({
    user,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();

  const user = await authenticationRequired(clonedRequest);
  console.log(user);
  const formData = await request.formData();

  type finalForm = {
    profilePicture: File;
    penName: string;
    bio: string;
  };
  const userDetails: finalForm = {
    profilePicture: formData.get("profilePicture") as File,
    penName: formData.get("penName") as string,
    bio: formData.get("bio") as string,
  };

  const photoPath = await uploadPhoto(userDetails.profilePicture)
    .then((obj) => obj.fullPath)
    .catch((_err) => _err.error);
  const updatedUser = await updateUser(
    { ...userDetails, profilePicture: photoPath },
    user.userId,
  );

  return redirect("/");
}

export default function Profile() {
  const user = useLoaderData<typeof loader>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profilePicture: "",
      penName: "",
      bio: "",
    },
  });

  const [preview, setPreview] = useState<string | null>(null);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <Form {...form}>
          <form method="post" encType="multipart/form-data" className="space-y-8 justify-center ">
          {preview ? <img src={preview} alt="Image preview"/> :
            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="profile picture"
                      accept="image/*"
                      {...field}
                    onChange={handleImageChange}/>
                  </FormControl>
                  <FormDescription>
                    Upload a picture you want to use for your profile picture
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            }
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
    </>
  );
}
