import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
