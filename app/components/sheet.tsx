import { Form, Link } from "@remix-run/react";
import { finalForm } from "~/routes/profile";

// Components
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { BottomTooltip } from "./tooltip";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";

// Icons
import { LogOutIcon, SquareUserRound, UserRound, Star } from "lucide-react";

// Authentication
import type { User } from "~/auth/authenticator.server";
import { BookmarksCard } from "./card";

type profileSheetProps = {
  user: User;
  userdetails: finalForm;
};

export function ProfileSheet({ user, userdetails }: profileSheetProps) {
  const listOfBookmarks = [
    {
      title: "my new poem",
      userid: 34,
    },
    {
      title: "my new poem",
      userid: 34,
    },
    {
      title: "my new poem",
      userid: 34,
    },
    {
      title: "my new poem",
      userid: 34,
    },
  ];
  return (
    <Sheet>
      <BottomTooltip content="profile" delayDuration={100}>
        <SheetTrigger asChild className="cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </SheetTrigger>
      </BottomTooltip>

      <SheetContent className="p-4 rounded-2xl dark:border-s-gray-800 w-[350px]">
        <div className="pb-4 border-b dark:border-b-gray-800">
          <SheetHeader className="flex flex-row justify-start items-start pb-4">
            {" "}
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="ps-4">
              <p
                className=" font-semibold text-lg"
                style={{ lineHeight: "1em" }}
              >
                {userdetails.penName}
              </p>
              <p
                className="text-sm text-slate-400"
                style={{ lineHeight: "1em" }}
              >
                {user.email}
              </p>
            </div>
          </SheetHeader>

          <SheetDescription className="pt-2">
            <div
              className="text-lg text-slate-300 flex items-center mb-1"
              style={{ lineHeight: "1em" }}
            >
              <SquareUserRound className="w-4 h-4 me-2" />
              Your Bio
            </div>
            {userdetails.bio}
          </SheetDescription>
        </div>

        {/* Other User Details */}
        <div className="py-3 border-b dark:border-b-gray-800">
          <Link to={"/profile"}>
            <div className="flex items-center justify-start">
              <UserRound className="w-4 h-4 me-2" />
              Your Profile
            </div>
          </Link>
        </div>
        <div className=" border-b dark:border-b-gray-800 flex flex-col items-center justify-start">
          <h2 className="flex p-4">
            <Star className="w-5 h-5 me-2" /> Bookmarks
          </h2>
          <BookmarksCard listOfBookmarks={listOfBookmarks} />
        </div>

        <SheetFooter className="flex flex-col sm:justify-start sm:items-start sm:space-x-0">
          <Form method="post" action="/logout">
            <Button
              size={"default"}
              className="text-lg ps-0 font-semibold border-none hover:no-underline text-red-500 bg-inherit hover:bg-inherit hover:text-red-400 rounded-lg dark:text-red-500 dark:bg-inherit hover:dark:bg-inherit hover:dark:text-red-400"
              variant={"link"}
              type="submit"
            >
              <LogOutIcon className="me-2 w-4 h-4" />
              Logout
            </Button>
          </Form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
