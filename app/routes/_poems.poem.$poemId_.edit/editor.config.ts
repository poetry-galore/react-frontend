import { defineConfig } from "@poetry-galore/rich-text-editor";

export const EDIT_POEM_CONFIG_NAME = "edit_poem_config";

// Define configuration for the editor used in the edit page.
defineConfig({
  name: EDIT_POEM_CONFIG_NAME,
  config: { plugins: { toolbar: false, floatingMenu: true } },
});
