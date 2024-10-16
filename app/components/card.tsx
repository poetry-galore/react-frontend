import { Link } from "@remix-run/react";
import moment from "moment";

// Icons
import { CalendarClockIcon, FeatherIcon, Bookmark } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { cn } from "~/lib/utils";

import { PoemWithAuthor } from "~/utils/poem.server";
import { title } from "process";

// ROUTES
const POEM_ROUTE = (poemId: string) => `/poem/${poemId.trim()}`;

type AuthCardProps = {
  title?: string;
  description?: string;
} & React.AllHTMLAttributes<HTMLDivElement>;

/**
 * Card used in authentication forms. ie. Login and register
 */
export function AuthCard({
  title,
  description,
  children,
  className,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        "w-11/12 md:w-[450px] shadow-none rounded-xl dark:bg-dark border-none",
        className,
      )}
    >
      {(title || description) && (
        <CardHeader className="text-center">
          {title && (
            <CardTitle className="text-4xl font-semibold">{title}</CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

type PoemCardProps = {
  poem: PoemWithAuthor;
} & React.AllHTMLAttributes<HTMLDivElement>;

/**
 * Card for displaying poems.
 */
export function PoemCard({ poem, children, className }: PoemCardProps) {
  // Format the updated date to a better format. eg Thu, 8th Aug 2024
  const updatedAt = moment(poem.updatedAt).format("ddd, Do MMM YYYY");

  return (
    <Card
      className={cn(
        "w-11/12 md:w-[750px] mb-10 p-3 md:p-5 rounded-xl border-none overflow-auto shadow shadow-slate-500 hover:bg-slate-200/90 dark:bg-dark dark:hover:bg-slate-800/50 dark:shadow-slate-700",
        className,
      )}
    >
      {
        <CardHeader className="text-start p-1 mb-1">
          <CardTitle className="text-3xl raleway mb-0.5 md:mb-1 antialiased">
            <Link to={POEM_ROUTE(poem.id)} className="hover:text-primary">
              {poem.title}
            </Link>
          </CardTitle>

          <CardDescription className="ms-2 flex justify-start items-center raleway italic text-slate-400 dark:text-slate-600">
            <FeatherIcon className="h-4 w-4 me-1" />
            <Link
              to="#"
              className="italic text-base font-semibold hover:text-slate-700 hover:underline hover:underline-offset-2 dark:hover:text-slate-400"
            >
              {/* TODO: Use username or pen name here */}
              {poem.author.penName ? poem.author.penName : poem.author.email}
            </Link>
          </CardDescription>
        </CardHeader>
      }
      <CardContent className="md:p-5 text-start text-lg">
        {children}
      </CardContent>

      <CardFooter className="flex justify-evenly items-center p-0 italic text-sm text-slate-400 dark:text-slate-600 space-x-80">
        <Bookmark className="h-7 w-5 cursor-pointer" />{" "}
        <div className="flex justify-self-end">
          <CalendarClockIcon className="h-4 w-4 me-1" /> {updatedAt}
        </div>
      </CardFooter>
    </Card>
  );
}

type ProfileCardProps = {
  name: string;
} & React.AllHTMLAttributes<HTMLDivElement>;

export function ProfileCard({ children, className }: ProfileCardProps) {
  return (
    <Card
      className={cn(
        "w-11/12 md:w-[750px] mb-10 p-3 md:p-5 rounded-xl border-none overflow-auto shadow shadow-slate-500 hover:bg-slate-200/90 dark:bg-dark dark:hover:bg-slate-800/50 dark:shadow-slate-700",
        className,
      )}
    >
      <CardHeader>
        <CardTitle>Complete your user profile</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>This is the card footer</CardFooter>
    </Card>
  );
}

export function BookmarksCard({ listOfBookmarks }) {
  return (
    <Card className="w-full border-0">
      <CardContent className="space-y-4">
        {listOfBookmarks.map((bookmark) => {
          return (
            <div
              key={bookmark.userid}
              className=" cursor-pointer border  rounded-xl text-center p-2"
            >
              <h3>{bookmark.title}</h3>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
