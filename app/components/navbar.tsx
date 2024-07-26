import { Form, Link, useLocation } from "@remix-run/react";

// Components
import { LogInIcon, LogOutIcon } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggler";
import { Button } from "~/components/ui/button";
import { NavbarLogo } from "~/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Input } from "~/components/ui/input";

// Authentication
import type { User } from "~/auth/authenticator.server";

// ROUTES
/**
 * Route to the page where to create a new poem
 */
const NEW_POEM_ROUTE = "/poem/new";

type NavbarProps = {
  /**
   * Current logged user
   */
  loggedUser?: User | null;
};

/**
 * Navigation bar
 */
export default function Navbar({ loggedUser }: NavbarProps) {
  const location = useLocation();

  return (
    <div className="lg:w-2/3 mx-auto my-5 flex justify-between  bg-white h-20 dark:bg-dark">
      <div className="flex items-center ms-1 sm:ms-2 md:ms-4 lg:ms-0">
        <div className="w-1/3 sm:w-2/5 h-11/12 flex justify-start">
          <Link to="/">
            <NavbarLogo />{" "}
          </Link>
        </div>
      </div>

      <div className="flex justify-end items-center me-1 sm:me-2 md:me-4 lg:me-0">
        <ThemeToggle className="me-1 lg:me-4" />

        {/** Create new poem button */}
        {loggedUser && location.pathname !== NEW_POEM_ROUTE && (
          <Link to={NEW_POEM_ROUTE}>
            <Button
              size={"default"}
              className="px-2 me-3 text-base font-semibold hover:text-primary dark:hover:text-primary"
              variant={"secondary"}
            >
              Create New
            </Button>
          </Link>
        )}

        {loggedUser ? (
          <Form method="post" action="/logout" className="group/logout flex">
            <Sheet>
              <SheetTrigger>
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>User Profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile
                  </SheetDescription>
                </SheetHeader>

                <Link to="logout" className="group/logout">
                  <Button
                    size={"default"}
                    className="text-lg font-semibold border-none text-red-500 bg-white hover:bg-white hover:text-red-400 rounded-lg dark:text-red-500 dark:bg-inherit hover:dark:bg-inherit hover:dark:text-red-400"
                    variant={"default"}
                    type="submit"
                  >
                    Logout{" "}
                    <LogOutIcon className="ms-1 w-4 h-4 group-hover/logout:translate-x-1.5 group-hover/logout:scale-110 duration-300 motion-reduce:scale-0 motion-reduce:translate-x-0" />
                  </Button>
                </Link>

                <Input type="text" placeholder="username" />
                <Input type="email" placeholder="email" />
              </SheetContent>
            </Sheet>
          </Form>
        ) : (
          <Link to="login" className="group/login">
            <Button
              size={"default"}
              className="text-lg font-semibold border-none text-sky-500 bg-white hover:bg-white hover:text-primary rounded-lg dark:text-primary dark:bg-inherit hover:dark:bg-inherit hover:dark:text-sky-500"
              variant={"default"}
            >
              Login{" "}
              <LogInIcon className="ms-1 w-4 h-4 group-hover/login:translate-x-1.5 group-hover/login:scale-110 duration-300 motion-reduce:scale-0 motion-reduce:translate-x-0" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
