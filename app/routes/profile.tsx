import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth/authenticator.server";

// Components
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";


import { updateUser, userUpdate, UpdateForm } from "~/utils/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const clonedRequest = request.clone();
  
    // Get authenticated user if there is one
    const user = await authenticator.isAuthenticated(clonedRequest);
  
    
    return json({
      user
    });
  }

export async function action({ request }: ActionFunctionArgs) {

    const clonedRequest = request.clone();

    const user  = authenticator.isAuthenticated(clonedRequest);
    console.log(user);
    const formData = await request.formData()

    const userDetails : UpdateForm = {
        email: formData.get("email") as string,
        penName: formData.get("penName") as string ,
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
        languages: formData.get("languages") as string,
    }
    
    const updatedUser = await updateUser(userDetails);

    return redirect('/')

}

export default function Profile() {

    const user  = useLoaderData <typeof loader>;

    return (
        <>
        <Navbar loggedUser={user}/>
        <div>
            <form method="post" className="flex flex-col items-center justify-center space-y-4 max-w-[70%]">
                <h1>Update your details</h1>
                <Input name="email" type="email"  placeholder="your email" required/>
                <Input name="penName" type="text" placeholder="your preferred pen name"required/>
                <Input name="bio" type="text" placeholder="What do you want people to know about you?"required/>
                <Input name="location" type="text" placeholder="what area are you located in?" required/>
                <Input name="languages" type="text" placeholder="What are your preferred languages?"required/>
                <Button
                size={"sm"}
                variant={"default"}
                className="font-semibold text-base disabled:select-none">
                    Update
                </Button>
            </form>
        </div>
        </>
    )
}