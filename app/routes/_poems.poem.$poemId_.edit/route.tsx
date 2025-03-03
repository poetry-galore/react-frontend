import { RichTextEditor } from "@poetry-galore/rich-text-editor";
import { CustomEditorState } from "@poetry-galore/types";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  replace,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";

// Components
import { UserAvatar } from "~/components/avatar";
import { LogoIcon } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggler";
import { Button } from "~/components/ui/button";
import { TitleInput } from "~/routes/_poems/components/input";

// Database
import {
  getPoemWithIdForUserOrThrow,
  PoemUpdateType,
  updatePoem,
} from "~/utils/poem.server";

// Authentication
import { authenticationRequired } from "~/auth/authenticator.server";

// Configuration
import { EDIT_POEM_CONFIG_NAME } from "./editor.config";

// ROUTES
/**
 * Returns route to the page where to view the poem.
 *
 * @param poemId id of the poem to view
 *
 * @example
 * console.log(POEM_ROUTE("123")) // 'poem/123'
 */
const POEM_ROUTE = (poemId: string) => `/poem/${poemId}`;

/**
 * Ensure that there is an authenticated user when accessing this page.
 * Also get the poem being edited from the database. IF not found, return
 * 404 error.
 *
 * @returns The poem and user data.
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await authenticationRequired(request);

  const poemId = params.poemId;
  const poem = await getPoemWithIdForUserOrThrow(poemId ? poemId : "", user);

  return json({ poem, user });
}

/**
 * Edit the poem with the form data.
 *
 * Redirects to the page with the edited poem
 */
export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();

  const user = await authenticationRequired(clonedRequest);
  const formData = await request.formData();

  const poemUpdate: PoemUpdateType = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  const poemId = formData.get("poemId") as string;

  // Check if the poem with poemId exists and is authored by the current user
  await getPoemWithIdForUserOrThrow(poemId ? poemId : "", user);

  await updatePoem(poemId, poemUpdate);

  return replace(POEM_ROUTE(poemId));
}

export default function EditPoem() {
  const { poem, user } = useLoaderData<typeof loader>();

  const [editorStateHTML, setEditorStateHTML] = useState<string>();
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  const [title, setTitle] = useState<string>(poem.title);

  /**
   * Callback called when the editor updates.
   *
   * - Checks whether the editor is empty
   * - Gets the JSON value of the editor content
   * - Gets the HTML value of the editor content
   */
  function onChange(customEditorState: CustomEditorState) {
    setIsEmpty(customEditorState.isEmpty());
    setEditorStateHTML(customEditorState.toHTML());
  }

  return (
    <>
      <div className="text-center text-2xl font-bold pt-5">Edit</div>
      <div className="relative flex items-start pt-5">
        <div className="w-1/12 lg:w-1/4 sticky top-10">
          <div className="max-w-20">
            <Link to="/">
              <LogoIcon className="max-w-20" />
            </Link>
          </div>

          <ThemeToggle className="ms-2.5 mt-5" />
        </div>
        {/** Editor */}
        <div className="w-5/6 lg:w-1/2">
          <TitleInput
            name="title"
            value={title}
            placeholder="Title"
            onChange={(event) => setTitle(event.currentTarget.value)}
          />

          <div className="ps-5">
            <ClientOnly fallback={<div>Loading... </div>}>
              {() => {
                return (
                  <RichTextEditor
                    onEditorChange={[{ onChange, ignoreSelectionChange: true }]}
                    initialEditorState={poem?.content}
                    configName={EDIT_POEM_CONFIG_NAME}
                  />
                );
              }}
            </ClientOnly>
          </div>
        </div>
        <div className="w-1/4 sticky top-10 flex flex-col items-start ms-5">
          <div className="flex space-x-2 items-center mb-5">
            <UserAvatar email={user.email} />
            <p>{user.email}</p>
          </div>
          <Form method="post">
            <input hidden name="poemId" defaultValue={poem?.id} />
            <input
              hidden
              name="content"
              value={editorStateHTML || ""}
              onChange={() => {}}
            />
            <input
              hidden
              name="title"
              value={title || ""}
              onChange={() => {}}
            />
            <Button
              size={"sm"}
              variant={"default"}
              className="font-semibold text-base disabled:select-none"
              disabled={editorStateHTML === poem?.content || isEmpty}
            >
              Save
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
