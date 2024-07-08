import { BugIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { cn } from "~/lib/utils";

type AlertProps = {
  title?: string;
  description?: string;
} & React.AllHTMLAttributes<HTMLDivElement>;

/**
 *  Alert for displaying errors
 */
export function AlertError({ title, description, className }: AlertProps) {
  return (
    <Alert
      variant="destructive"
      className={cn("flex justify-center space-x-2 border-none", className)}
    >
      <div className="pt-1">
        <BugIcon className="h-5 w-5" />
      </div>
      <div className="flex flex-col items-start justify-center">
        {title && (
          <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
        )}
        {description && (
          <AlertDescription className="text-base font-semibold">
            {description}
          </AlertDescription>
        )}
      </div>
    </Alert>
  );
}

/**
 *  Alert for displaying normal information
 */
export function AlertInfo({ title, description, className }: AlertProps) {
  return (
    <Alert
      variant="default"
      className={cn(
        "flex justify-center items-center space-x-2 border-none bg-primary/70 dark:bg-primary/70 h-10",
        className
      )}
    >
      <div className="pt-1">
        <InfoIcon className="h-5 w-5" />
      </div>
      <div className="flex flex-col items-start justify-center">
        {title && (
          <AlertTitle className="text-lg font-semibold">{title}</AlertTitle>
        )}
        {description && (
          <AlertDescription className="text-base font-semibold">
            {description}
          </AlertDescription>
        )}
      </div>
    </Alert>
  );
}
