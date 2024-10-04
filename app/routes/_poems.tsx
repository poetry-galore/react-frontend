import { defineConfig } from "@poetry-galore/rich-text-editor";
import { Outlet } from "@remix-run/react";

export const NEW_POEM_CONFIG_NAME = "new_poem_config";

// Define Configurations for the editors used in the new and edit pages.
defineConfig([
  {
    name: NEW_POEM_CONFIG_NAME,
    config: { plugins: { toolbar: false, floatingMenu: true } },
  },
]);

export default function PoemsLayout() {
  return (
    <div className="relative max-w-[1920px]">
      <Outlet />
    </div>
  );
}
