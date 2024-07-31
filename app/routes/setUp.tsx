import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { profile } from "console";
import { authenticationRequired, authenticator } from "~/auth/authenticator.server";



export async function loader( {request }:  LoaderFunctionArgs) {
    const  user  = await authenticationRequired(request);

    const defaultValues = {
        username: 'Your preferred username ...',
        penName: 'Your pseduonym',
        email: user.email,
        bio: 'Details about who you are as poem lover',
        dob: '01/01/2019',
        gender: 'your gender ...',
        location: 'country and city you are located in ...',
        profilePicture: '.svg'
    }
    return defaultValues; 
}


export default async function updateProfile() {
    const data  = useLoaderData< typeof loader>();

    return (
        <>
        <h1>User information</h1>
        <Form method="post">
            <label>
                Profile Picture: 
                <input type="image" alt="profile picture" required/>
            </label>
            <label>
                Username: 
                <input type="text" placeholder={data.username} required/>
            </label>
            <label>
                Pen name: 
                <input type="text" placeholder={data.penName} />
            </label>
            <label>
                email: 
                <input type="email" placeholder={data.email}/>
            </label>
            <label>
                Bio:
                <textarea placeholder={data.bio}/>
            </label>
            <label>
                Date of birth:
                <input type="number" required/>
            </label>
            <label>
                Gender: <select>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to specify!</option>
                </select>
            </label>
            <button type="submit">Update</button>

        </Form>
        </>
    )
}