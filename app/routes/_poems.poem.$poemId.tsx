import { Poem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Markup } from "interweave";

// Poem
import { getPoemWithId } from "~/utils/poem.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const poemId = params.poemId;
  let poem: Poem | null = null;

  try {
    if (poemId) poem = await getPoemWithId(poemId);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Response(null, { status: 404, statusText: "Poem not found" });
    } else {
      throw error;
    }
  }
  return json({ poem });
}

export default function ShowPoem() {
  const { poem } = useLoaderData<typeof loader>();

  return (
    <>
      <Markup content={poem?.content} />
    </>
  );
}
