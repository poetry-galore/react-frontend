import { useRef, type InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

import { Input } from "~/components/ui/input";
import useAutosizeTextArea from "~/hooks/useAutosizeTextarea";
import { cn } from "~/lib/utils";
import { Textarea, TextareaProps } from "./ui/textarea";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

/**
 * Input used in authentication forms. ie login and register
 */
export function AuthInput({ name, label, ...rest }: InputProps) {
  const { error, getInputProps } = useField(name);
  const className = rest.className;

  delete rest.className;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="font-semibold text-sm select-none" htmlFor={name}>
        {label}
      </label>

      <Input
        className="text-gray-900 text-sm rounded-lg block w-full transition-none focus-visible:ring-2 dark:bg-dark dark:placeholder-gray-400 dark:text-white"
        {...getInputProps({ id: name })}
        {...rest}
        autoComplete="false"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
}

export function ProfileInput({ name, label, ...rest }: InputProps) {
  const { error, getInputProps } = useField(name);
  const className = rest.className;

  delete rest.className;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="font-semibold text-sm select-none" htmlFor={name}>
        {label}
      </label>
      <Input
        className="text-gray-900 text-sm rounded-lg block w-full transition-none focus-visible:ring-2 dark:bg-dark dark:placeholder-gray-400 dark:text-white"
        {...getInputProps({ id: name })}
        {...rest}
        autoComplete="false"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
}

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
