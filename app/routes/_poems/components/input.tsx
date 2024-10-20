import { useRef } from "react";

import { Textarea, TextareaProps } from "~/components/ui/textarea";
import useAutosizeTextArea from "~/hooks/useAutosizeTextarea";
import { cn } from "~/lib/utils";

/**
 * Input for a title in the new and edit poem pages.
 */
export function TitleInput({ name, ...rest }: TextareaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(
    textAreaRef.current,
    rest.value ? rest.value.toString() : "",
  );

  return (
    <Textarea
      {...rest}
      className={cn(
        rest.className,
        "text-3xl max-w-full ps-5 resize-none transition-none outline-none border-0 rounded-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground placeholder:text-slate-300 dark:placeholder:text-muted-foreground dark:placeholder:text-slate-700",
      )}
      name={name}
      ref={textAreaRef}
      rows={1}
    />
  );
}
