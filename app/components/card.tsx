import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Markup } from "interweave";
import { cn } from "~/lib/utils";

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
        className
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
  title: string;
  description?: string;
  content: string;
  author: string;
} & React.AllHTMLAttributes<HTMLDivElement>;

export function PoemCard({
  title,
  description,
  content,
  author,
  children,
  className,
}: PoemCardProps) {
  return (
    <Card
      className={cn(
        "max-h-[350px] xl:max-h-[550px] text-center shadow-none rounded-xl dark:bg-dark border-none",
        className
      )}
    >
      {(title || description) && (
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <CardDescription className="font-semibold">
            {description}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <p className="max-h-[190px] xl:max-h-[410px] overflow-hidden text-ellipsis whitespace-pre-wrap">
          <Markup content={content} />
          {children}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex justify-end w-full">
            <p>
              by{" "}
              <Link
                to="#"
                className="italic font-semibold text-primary dark:text-primary underline underline-offset-2"
              >
                {author}
              </Link>
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
