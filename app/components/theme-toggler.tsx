import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "~/components/ui/button";

/**
 * Toggle theme between light & dark modes.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <Button
      className="ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 w-8"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
