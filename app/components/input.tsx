import type { InputHTMLAttributes } from "react";
import { useField } from "remix-validated-form";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

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
        className="text-gray-900 text-sm rounded-lg block w-full focus-visible:ring-2 dark:bg-dark dark:placeholder-gray-400 dark:text-white"
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
