/**
 * Action for toggling the theme
 */

import { createThemeAction } from "remix-themes";

import { themeSessionResolver } from "~/theme/session.server";

export const action = createThemeAction(themeSessionResolver);
