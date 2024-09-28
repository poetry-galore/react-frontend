import { RichTextEditor } from "@poetry-galore/rich-text-editor";
import type { CustomEditorState } from "@poetry-galore/types";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

// Components
import { UserAvatar } from "~/components/avatar";
import { LogoIcon } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggler";
import { Button } from "~/components/ui/button";

// Authentication
import { authenticationRequired } from "~/auth/authenticator.server";

// Database
import { createPoem, type PoemCreateType } from "~/utils/poem.server";

// ROUTES
/**
 * Returns route to a poem with the given poemId
 */
const POEM_ROUTE = (poemId: string) => `/poem/${poemId}`;

/**
 * Ensure that there is an authenticated user when accessing this page.
 *
 * @returns The user data
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticationRequired(request);

  return json({ user });
}

/**
 * Create a new poem with the form data.
 *
 * Redirects to the page with the new poem
 */
export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();

  const user = await authenticationRequired(clonedRequest);
  const formData = await request.formData();

  const poemCreate: PoemCreateType = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    authorId: user.userId,
  };

  const newPoem = await createPoem(poemCreate);

  return redirect(POEM_ROUTE(newPoem.id));
}

/**
 * Create a new poem
 */
export default function NewPoem() {
  const { user } = useLoaderData<typeof loader>();

  const [editorStateJSON, setEditorStateJSON] = useState<any>();
  const [editorStateHTML, setEditorStateHTML] = useState<string>();
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  const [title, setTitle] = useState<string>("");

  /** Set the title to the first statement */
  useEffect(() => {
    try {
      let index = 0;
      // Get the text in a node at given index
      const nodeText = (index: number) =>
        editorStateJSON?.root?.children[index]?.children[0]?.text;

      do {
        setTitle(nodeText(index));
        index++;
      } while (
        index < editorStateJSON?.root.children.length &&
        !nodeText(index === 0 ? 0 : index - 1)
      );
    } catch (error: any) {
      console.log(error);
    }
  }, [editorStateJSON]);

  /**
   * Callback called when the editor updates.
   *
   * - Checks whether the editor is empty
   * - Sets the JSON value of the editor content
   * - Sets the HTML value of the editor content
   */
  function onChange(customEditorState: CustomEditorState, tags?: Set<string>) {
    setIsEmpty(customEditorState?.isEmpty());
    setEditorStateJSON(customEditorState?.toJSON());
    setEditorStateHTML(customEditorState?.toHTML());
  }

  return (
    <>
      <div className="relative flex items-start pt-10">
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
          <RichTextEditor
            onEditorChange={[{ onChange, ignoreSelectionChange: true }]}
          />
        </div>
        <div className="w-1/4 sticky top-10 flex flex-col items-start ms-5">
          <div className="flex space-x-2 items-center mb-5">
            <UserAvatar email={user.email} />
            <p>{user.email}</p>
          </div>
          <Form method="post">
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
              disabled={isEmpty}
            >
              Publish
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
