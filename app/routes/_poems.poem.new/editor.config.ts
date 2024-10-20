import { defineConfig } from "@poetry-galore/rich-text-editor";

export const NEW_POEM_CONFIG_NAME = "new_poem_config";

// Define configuration for the editor used in the new page.
defineConfig({
  name: NEW_POEM_CONFIG_NAME,
  config: { plugins: { toolbar: false, floatingMenu: true } },
});
