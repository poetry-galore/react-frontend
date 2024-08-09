import { Form, Link } from "@remix-run/react";

// Components
import { LogInIcon, LogOutIcon } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggler";
import { Button } from "~/components/ui/button";
import { NavbarLogo } from "~/components/logo";

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

  /**
   * Whether to show the create poem button
   *
   * @default true
   */
  showCreatePoem?: boolean;
};

/**
 * Navigation bar
 */
export default function Navbar({
  loggedUser,
  showCreatePoem = true,
}: NavbarProps) {
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
        {loggedUser && showCreatePoem && (
          <Link to={NEW_POEM_ROUTE}>
            <Button
              size={"default"}
              className="px-2 me-3 text-base font-semibold transition-none hover:text-primary dark:hover:text-primary"
              variant={"secondary"}
            >
              Create New
            </Button>
          </Link>
        )}

        {loggedUser ? (
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
        ) : (
          <Link to="/login" className="group/login">
            <Button
              size={"default"}
              className="text-lg font-semibold border-none text-sky-500 bg-inherit hover:bg-inherit hover:text-primary rounded-lg dark:text-primary dark:bg-inherit hover:dark:bg-inherit hover:dark:text-sky-500"
              variant={"secondary"}
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
