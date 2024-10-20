import { Link } from "@remix-run/react";

// Components
import { LogInIcon } from "lucide-react";
import { NavbarLogo } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggler";
import { Button } from "~/components/ui/button";
import { ProfileSheet } from "./sheet";

// Authentication
import type { User } from "~/auth/authenticator.server";

import { ProfileFormType } from "~/routes/profile/route";

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

  userdetails: ProfileFormType;
};

/**
 * Navigation bar
 */
export default function Navbar({
  loggedUser,
  showCreatePoem = true,
  userdetails,
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
          <ProfileSheet user={loggedUser} userdetails={userdetails} />
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
