import { finalForm } from "~/routes/profile";
import type { User } from "~/auth/authenticator.server";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

import { Form, Link } from "@remix-run/react";
import { LogOutIcon } from "lucide-react";


type profileSheetProps = {
  user: User,
  userdetails: finalForm

}
export function ProfileSheet({ user, userdetails }: profileSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

      </SheetTrigger>

      <SheetContent>
        <SheetHeader></SheetHeader>
        <SheetDescription>.........................</SheetDescription>
        <div className="grid gap-1 py-3 text-[#00d1cd]">
          <div className="p-4 place-content-center  rounded-lg">
            <p className="text-xl font-semibold">{userdetails.penName}</p>
            <p className="text-sm">{user.email}</p>
          </div>
          <div className="p-4 shadow-lg rounded-md">

            <p className="text-[#00d1cd]">{userdetails.bio}</p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose className="gap-4  place-content-between space-y-8">
            <Link to={"/profile"}>
              <Button variant={"secondary"}>Update your details!</Button>
            </Link>

            <Form method="post" action="/logout" className="group/logout">
              <Button
                size={"default"}
                className="text-lg font-semibold border-none text-red-500 bg-inherit hover:bg-inherit hover:text-red-400 rounded-lg dark:text-red-500 dark:bg-inherit hover:dark:bg-inherit hover:dark:text-red-400"
                variant={"secondary"}
                type="submit"
              >
                Logout
                <LogOutIcon className="ms-1 w-4 h-4 group-hover/logout:translate-x-1.5 group-hover/logout:scale-110 duration-300 motion-reduce:scale-0 motion-reduce:translate-x-0" />
              </Button>
            </Form>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
