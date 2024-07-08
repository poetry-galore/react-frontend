import { Theme, useTheme } from "remix-themes";

import LogoIconOnly from "../images/logo-icon-only.svg";
import LogoDark from "../images/logo-dark.svg";
import LogoLight from "../images/logo-light.svg";
import LogoNameOnlyDark from "../images/logo-name-only-dark.svg";

/**
 * Logo Icon Only.
 */
export function LogoIcon({
  className,
}: React.AllHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className}>
      <img src={LogoIconOnly} alt="Poetry Galore Logo Icon" />
    </div>
  );
}

/**
 * Logo Name only. ie `Poetry Galore`
 */
export function LogoName({
  className,
}: React.AllHTMLAttributes<HTMLDivElement>) {
  const [theme] = useTheme();

  return (
    <div className={className}>
      <img
        src={theme === Theme.LIGHT ? LogoNameOnlyDark : LogoNameOnlyDark}
        alt="Poetry Galore Logo"
      />
    </div>
  );
}

type LogoFullProps = {
  themeOverride?: Theme;
} & React.AllHTMLAttributes<HTMLDivElement>;

/**
 * Logo with Icon and Name.
 */
export function LogoFull({ themeOverride, className }: LogoFullProps) {
  const [theme] = useTheme();

  return (
    <div className={className}>
      <img
        src={
          themeOverride
            ? themeOverride === Theme.LIGHT
              ? LogoLight
              : LogoDark
            : theme === Theme.LIGHT
              ? LogoLight
              : LogoDark
        }
        alt="Poetry Galore Logo"
      />
    </div>
  );
}

/**
 * Logo used in Navbar.
 */
export function NavbarLogo({
  className,
}: React.AllHTMLAttributes<HTMLDivElement>) {
  const [theme] = useTheme();

  return (
    <div className={className}>
      <img
        src={LogoIconOnly}
        alt="Poetry Galore"
        sizes="(max-width: 640px) 216px, 1000px"
        srcSet={`${LogoIconOnly} 216w, ${theme === Theme.LIGHT ? LogoLight : LogoDark} 1000w`}
      />
    </div>
  );
}
